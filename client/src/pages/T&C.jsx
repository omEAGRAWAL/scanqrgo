import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          [YOUR PLATFORM NAME] - Terms and Conditions
        </h1>
        <p className="text-center text-sm text-gray-600 mb-10">
          <strong>Effective Date:</strong> [Date] |{" "}
          <strong>Last Updated:</strong> [Date]
        </p>

        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">
          {/* 1. ACCEPTANCE OF TERMS */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms and Conditions ("Agreement") constitute a binding
              contract between you ("Customer," "User," "you," or "your") and
              [Your Name], operating under sole proprietorship ("Service
              Provider," "we," "us," or "our"). By accessing, using, or
              subscribing to [Platform Name], you agree to these terms.
            </p>
          </section>

          {/* 2. DEFINITIONS */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              2. Definitions
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                “Service”: [Platform Name]'s brand feedback and promotion
                platform
              </li>
              <li>“Free Tier”: Basic plan with usage limitations</li>
              <li>“Pro Plan”: Full-featured subscription tier</li>
              <li>
                “Campaign”: A feedback initiative for specific
                products/promotions
              </li>
              <li>
                “Response Data”: Feedback, survey responses, ratings collected
              </li>
              <li>
                “Usage Limitations”: Tier restrictions applied to Free accounts
              </li>
              <li>
                “Third-Party Services”: Payment gateways, cloud providers, APIs
                etc.
              </li>
            </ul>
          </section>

          {/* 3. SERVICE DESCRIPTION */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              3. Service Description
            </h2>
            <h3 className="font-semibold">Platform Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Brand dashboard for campaigns</li>
              <li>QR code generation for customer feedback</li>
              <li>Analytics & reports</li>
              <li>Marketplace integration (Amazon, Flipkart)</li>
              <li>Promotional features (discounts, warranties)</li>
            </ul>
          </section>

          {/* 4. SUBSCRIPTION PLANS */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              4. Subscription Plans and Pricing
            </h2>
            <table className="w-full table-auto border border-gray-200 text-center text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Plan</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Effective / Month</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Free Tier</td>
                  <td className="border px-4 py-2">₹0</td>
                  <td className="border px-4 py-2">Limited</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Pro Monthly</td>
                  <td className="border px-4 py-2">₹2,499</td>
                  <td className="border px-4 py-2">₹2,499</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Pro Half-Yearly</td>
                  <td className="border px-4 py-2">₹12,499</td>
                  <td className="border px-4 py-2">₹2,083</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Pro Annual</td>
                  <td className="border px-4 py-2">₹22,499</td>
                  <td className="border px-4 py-2">₹1,875</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs mt-2 text-gray-500">
              All prices include GST.
            </p>
          </section>

          {/* 5. THIRD-PARTY SERVICES */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              5. Third-Party Services and Data Collection
            </h2>
            <p>
              Payments are processed through trusted gateways (Razorpay,
              Instamojo). These services collect and store data under their own
              privacy policies.
              <strong>
                {" "}
                We do not store or control sensitive payment details.{" "}
              </strong>
            </p>
          </section>

          {/* DATA PROTECTION */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              7. Data Protection and Privacy
            </h2>
            <p>
              You retain ownership of all customer feedback and data. We process
              it only to provide our Service. Compliance is maintained with{" "}
              <strong>DPDPA 2023</strong>, the IT Act 2000, and Indian privacy
              laws.
            </p>
          </section>

          {/* INTELLECTUAL PROPERTY & LIABILITY */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              8-9. Intellectual Property Rights & Liability
            </h2>
            <p>
              We retain all rights to the service platform and software. You
              retain all rights to your brand and customer content. Our
              liability is limited to subscription fees paid in the last 12
              months.
            </p>
          </section>

          {/* TERMINATION */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              11. Termination
            </h2>
            <p>
              You may cancel anytime. No refunds for unused periods. Pro Plan
              data is accessible for 30 days post-cancellation.
            </p>
          </section>

          {/* JURISDICTION */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              12. Legal Compliance and Jurisdiction
            </h2>
            <p>
              These terms are governed by the laws of India. Courts of{" "}
              <strong>Bengaluru, Karnataka</strong>
              shall have exclusive jurisdiction.
            </p>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              15. Contact Information
            </h2>
            <p className="mb-2">Service Provider: [Your Full Name]</p>
            <p>
              Email: support@[platform-domain].com | Phone: +91-[Your Number]
            </p>
            <p>
              Legal: legal@[platform-domain].com | Grievance:
              grievance@[platform-domain].com
            </p>
          </section>

          {/*  DISCLAIMER BOX */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <h3 className="font-semibold text-yellow-800">
              Important Third-Party Disclaimer
            </h3>
            <p className="text-sm text-gray-800 mt-2">
              By using [Platform Name], you acknowledge that third-party
              providers (payment gateways, cloud providers, etc.) may directly
              collect and process your data. Their privacy and security
              practices govern collection, and we are not responsible for such
              third-party operations.
            </p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-10">
            This document was last updated on [Date]. These Terms are effective
            immediately for new users and upon next login for existing users.
          </p>
        </div>
      </div>
    </div>
  );
}
