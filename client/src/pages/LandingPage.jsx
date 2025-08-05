import React from "react";
import { Link } from "react-router-dom";
import Heromage from "../assets/scanmobile.png"; // Adjust the path as necessary
import Navbar from "./NavBar";
// Helper component for the hero image graphic
const HeroImage = () => (
  <div className="relative w-full max-w-lg mx-auto">
    <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-30"></div>
    <img
      //C:\Users\Om - Gandu\Desktop\scanqrgo\client\src\assets\scanmobile.png
      src={Heromage}
      alt="Phone showing a QR code scan"
      className="relative z-10 w-10% h-auto rounded-lg shadow-lg"
    />
  </div>
);

// Helper component for star ratings
const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center">
    {Array.from({ length: rating }).map((_, index) => (
      <svg
        key={index}
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Navbar */}
      {/* <Navbar /> */}
      {/* <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl" role="img" aria-label="QR Code icon">
              📱
            </span>
            <span className="text-xl font-bold text-gray-900">ScanQRGo</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Why It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Testimonials
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header> */}

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-70"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Turn Every Purchase into a 5-Star Review
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
                Collect more reviews and leads with smart QR code funnels—fully
                compliant with Amazon, eBay, and Shopify.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Start Free
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
                >
                  See How It Works
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <HeroImage />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Simple 4-step process to boost your reviews and grow your
              business.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 text-blue-600 rounded-full text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Create Campaign
                </h3>
                <p className="text-gray-600">
                  Set up your review funnel with our pre-built templates.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-purple-100 text-purple-600 rounded-full text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Print Insert Card
                </h3>
                <p className="text-gray-600">
                  Include QR code cards in your product packages.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-pink-100 text-pink-600 rounded-full text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Customer Scans QR
                </h3>
                <p className="text-gray-600">
                  Customers scan and follow the smart funnel.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 text-green-600 rounded-full text-3xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Collect Reviews
                </h3>
                <p className="text-gray-600">
                  Get more 5-star reviews and valuable feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Works (Features) Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              Why It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-3xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  100% Compliant
                </h3>
                <p className="text-gray-600">
                  Follow all marketplace rules without violating terms of
                  service.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Collect Emails
                </h3>
                <p className="text-gray-600">
                  Build your email list while gathering feedback in one place.
                </p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Easy Setup
                </h3>
                <p className="text-gray-600">
                  Get started in minutes with pre-built templates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-2xl font-semibold text-gray-700 mb-8">
              Works With All Major Platforms
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
              <span className="text-lg font-medium text-gray-600">Amazon</span>
              <span className="text-lg font-medium text-gray-600">eBay</span>
              <span className="text-lg font-medium text-gray-600">Etsy</span>
              <span className="text-lg font-medium text-gray-600">Shopify</span>
              <span className="text-lg font-medium text-gray-600">Walmart</span>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              What Our Users Say
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-left">
                <div className="flex items-center mb-4">
                  <img
                    className="w-12 h-12 rounded-full mr-4"
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Sarah Johnson"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Sarah Johnson
                    </h4>
                    <p className="text-gray-500 text-sm">Amazon Seller</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Increased our review rate by 400% in just 2 months. The QR
                  code system is genius!"
                </p>
                <StarRating />
              </div>
              <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-left">
                <div className="flex items-center mb-4">
                  <img
                    className="w-12 h-12 rounded-full mr-4"
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Mike Chen"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mike Chen</h4>
                    <p className="text-gray-500 text-sm">Shopify Store Owner</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Finally a solution that's actually compliant. No more
                  worrying about policy violations."
                </p>
                <StarRating />
              </div>
              <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-left">
                <div className="flex items-center mb-4">
                  <img
                    className="w-12 h-12 rounded-full mr-4"
                    src="https://randomuser.me/api/portraits/men/86.jpg"
                    alt="David Wilson"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      David Wilson
                    </h4>
                    <p className="text-gray-500 text-sm">eBay Seller</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Setup was incredibly easy. Started seeing results within the
                  first week of using it."
                </p>
                <StarRating />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to boost your reviews?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start your free trial today. No credit card required.
            </p>
            <Link
              to="/register"
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
        {/* --- Pricing Table Section --- */}
        <section
          id="pricing"
          className="py-20 bg-gradient-to-b from-white via-blue-50 to-white"
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-center text-gray-600 mb-14">
              Choose the plan that fits your growth stage. No hidden fees.
              Cancel anytime.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center px-8 py-10 border-2 border-gray-100">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">
                  $19<span className="text-base font-normal">/month</span>
                </div>
                <ul className="text-gray-700 mb-6 space-y-2 text-sm">
                  <li>✅ Up to 500 scans/month</li>
                  <li>✅ Basic templates</li>
                  <li>✅ Email support</li>
                </ul>
                <button className="w-full bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold transition hover:bg-gray-300 cursor-pointer">
                  Get Started
                </button>
              </div>
              {/* Business Plan */}
              <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center px-8 py-10 border-4 border-blue-500 relative scale-105 z-10">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full px-4 py-1 text-xs font-semibold">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold mb-2">Business</h3>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">
                  $49<span className="text-base font-normal">/month</span>
                </div>
                <ul className="text-gray-700 mb-6 space-y-2 text-sm">
                  <li>✅ Up to 2,000 scans/month</li>
                  <li>✅ Advanced templates</li>
                  <li>✅ Priority support</li>
                  <li>✅ Analytics dashboard</li>
                </ul>
                <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition">
                  Get Started
                </button>
              </div>
              {/* Enterprise Plan */}
              <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center px-8 py-10 border-2 border-gray-100">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">
                  $99<span className="text-base font-normal">/month</span>
                </div>
                <ul className="text-gray-700 mb-6 space-y-2 text-sm">
                  <li>✅ Unlimited scans</li>
                  <li>✅ Custom templates</li>
                  <li>✅ 24/7 support</li>
                  <li>✅ API access</li>
                </ul>
                <button className="w-full bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-300 cursor-pointer">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-5">
              <div className="bg-blue-50 rounded-lg p-5 shadow-sm">
                <h4 className="font-semibold mb-2 text-blue-700">
                  Is this compliant with Amazon's terms of service?
                </h4>
                <p className="text-gray-700">
                  Yes, our system is 100% compliant with all major marketplace
                  policies including Amazon, eBay, and Shopify.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-5 shadow-sm">
                <h4 className="font-semibold mb-2 text-blue-700">
                  How do QR codes work for collecting reviews?
                </h4>
                <p className="text-gray-700">
                  Customers scan the QR code which takes them through a smart
                  funnel that guides them to leave reviews while collecting
                  their contact information.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-5 shadow-sm">
                <h4 className="font-semibold mb-2 text-blue-700">
                  Can I customize the review funnel?
                </h4>
                <p className="text-gray-700">
                  Yes, you can customize templates, add your branding, and
                  create different funnels for different products or campaigns.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer Section --- */}
      <footer className="bg-gray-900 text-gray-100 pt-12 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between items-center gap-8">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <span className="text-2xl" role="img" aria-label="ScanQRGo logo">
              📱
            </span>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ScanQRGo
            </span>
          </div>
          <div className="text-sm text-gray-400 text-center md:text-left mb-6 md:mb-0">
            © {new Date().getFullYear()} ScanQRGo. All rights reserved.
          </div>
          <div className="flex space-x-5">
            <a
              href="mailto:hello@scanqrgo.com"
              className="hover:text-blue-300 transition"
            >
              Contact
            </a>
            <a href="/privacy" className="hover:text-blue-300 transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-300 transition">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="pt-6 flex justify-center text-2xl space-x-6">
          <a
            href="https://twitter.com/"
            aria-label="Twitter"
            className="hover:text-blue-400 transition"
          >
            🐦
          </a>
          <a
            href="https://linkedin.com/"
            aria-label="LinkedIn"
            className="hover:text-blue-400 transition"
          >
            💼
          </a>
          <a
            href="https://github.com/"
            aria-label="GitHub"
            className="hover:text-blue-400 transition"
          >
            💻
          </a>
        </div>
      </footer>
    </div>
  );
}
