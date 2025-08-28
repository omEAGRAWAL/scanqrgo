// controllers/admin.controller.js
const User = require('../models/User');

function parseISOOrNull(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

exports.updateUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, freeTrialEnd, activeUntil } = req.body || {};

    // Basic validation
    const allowed = ['freeTrial', 'active', 'expired'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use freeTrial | active | expired' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();

    if (status === 'freeTrial') {
      let parsedFreeTrialEnd = parseISOOrNull(freeTrialEnd);
      if (!parsedFreeTrialEnd) {
        // default to 10 days
        parsedFreeTrialEnd = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      }
      if (parsedFreeTrialEnd <= now) {
        return res.status(400).json({ message: 'freeTrialEnd must be in the future' });
      }
      user.subscription.status = 'freeTrial';
      user.subscription.freeTrialStart = now;
      user.subscription.freeTrialEnd = parsedFreeTrialEnd;
      user.subscription.activeUntil = undefined;
    }

    if (status === 'active') {
      const parsedActiveUntil = parseISOOrNull(activeUntil);
      if (!parsedActiveUntil) {
        return res.status(400).json({ message: 'activeUntil (ISO date) is required for active' });
      }
      if (parsedActiveUntil <= now) {
        return res.status(400).json({ message: 'activeUntil must be in the future' });
      }
      user.subscription.status = 'active';
      user.subscription.activeUntil = parsedActiveUntil;
      // Keep past trial dates for auditing; do not modify them here
    }

    if (status === 'expired') {
      user.subscription.status = 'expired';
      user.subscription.activeUntil = undefined;
      // Keep freeTrial dates as history
    }

    await user.save();
    return res.json({
      message: 'Subscription updated',
      user: {
        _id: user._id,
        email: user.email,
        subscription: user.subscription,
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
};
