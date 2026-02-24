import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AmazonLogo from "../assets/Amazon logo.png";
import ShopifyLogo from "../assets/shopify.png";
import ReviuLogo from "../assets/Reviu_Logo.png";
import Button from "../components/base/Button";
import ReviewCard1 from "../assets/Review Card1.png";
import ReviewCard2 from "../assets/Review Card2.png";
import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import { FiShield, FiMessageSquare, FiStar, FiMinusCircle, FiPlusCircle, FiCheck, FiTwitter, FiFacebook, FiInstagram, FiGithub } from "react-icons/fi";
import LogoDevPunya from "../assets/logo_devpunya.png";
import LogoOoge from "../assets/logo_ooge.png";
import TestimonialBg from "../assets/testimonia_background.png";
import TestimonialImg from "../assets/testimonail.png";
import GetInTouchImg from "../assets/get_in_touch.png";
import AmazonLogostraight from "../assets/amazon_straight.png";
import ShopifyLogostraight from "../assets/shopyfy_straight.png";

import { API_URL } from "../config/api";
import axios from "axios";

// --- Components ---

const NavBar = () => {
  const navLinks = [
    "Platforms",
    "How it works",
    "Integration",
    "Compliance",
    "Pricing",
    "FAQ",
    "Contact us",
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={ReviuLogo} alt="Reviu" className="h-8 md:h-10" />
          </Link>
        </div>

        {/* Links (Hidden on mobile for simplicity, or we can make a mobile menu later) */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="hover:text-blue-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
};



export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState(0);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phone: "",
    message: "",
  });
  const [status, setStatus] = React.useState("idle"); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        number: `${formData.countryCode} ${formData.phone}`,
        message: formData.message,
      };

      await axios.post(`${API_URL}/connect`, payload);
      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+1",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  const faqs = [
    {
      q: "Is this compliant with Amazon's terms of service?",
      a: "Yes. Reviu.Store is fully compliant including Amazon and Shopify. Every campaign follows platform rules and best practices.",
    },
    {
      q: "How does the system collect feedback from customers?",
      a: "Customers are guided through an automated post-purchase flow that makes sharing genuine feedback effortless and fully compliant.",
    },
    {
      q: "Can I customize the review funnel?",
      a: "Absolutely! Add your branding, tweak templates, and create funnels for different products or campaigns.",
    },
    {
      q: "Are QR codes allowed for Amazon reviews?",
      a: "Yes, using QR codes on product inserts is allowed as long as you do not incentivize reviews or specifically ask only for positive feedback.",
    },
    {
      q: "How does Reviu stay compliant with Amazon review policies?",
      a: "Reviu is built to be neutral and objective, ensuring that the review request flow complies with Amazon's selling policies regarding customer communication.",
    },
    {
      q: "Can QR codes be included inside product packaging?",
      a: "Yes, placing QR codes inside product packaging is a standard practice for directing customers to warranty registration, instructions, or neutral review flows.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FF] font-sans relative overflow-x-hidden">
      <Helmet>
        <title>Amazon Review QR Code Software for Sellers</title>
        <meta
          name="description"
          content="Collect honest Amazon and Shopify product reviews using QR codes built for marketplace compliance."
        />
        <meta
          name="keywords"
          content="reviews, amazon reviews, shopify reviews, qr code reviews, ecommerce, trust, sales"
        />
        <link rel="canonical" href="https://reviu.store" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://reviu.store/" />
        <meta
          property="og:title"
          content="Amazon Review QR Code Software for Sellers"
        />
        <meta
          property="og:description"
          content="Collect honest Amazon and Shopify product reviews using QR codes built for marketplace compliance."
        />
        <meta property="og:image" content="https://reviu.store/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://reviu.store/" />
        <meta
          property="twitter:title"
          content="Amazon Review QR Code Software for Sellers"
        />
        <meta
          property="twitter:description"
          content="Collect honest Amazon and Shopify product reviews using QR codes built for marketplace compliance."
        />
        <meta
          property="twitter:image"
          content="https://reviu.store/twitter-image.jpg"
        />
      </Helmet>

      {/* --- HEADER --- */}
      {!localStorage.getItem("token") && <NavBar />}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 md:pt-32 overflow-hidden z-10">

        {/* Amazon Logo Floating Left */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 hidden lg:block z-20 pointer-events-none">
          <div className="transform -rotate-12">
            <div className="">
              <img src={AmazonLogo} alt="Amazon" className="w-40 opacity-60" />
            </div>
          </div>
        </div>

        {/* Shopify Logo Floating Right */}
        <div className="absolute top-2/3 right-0 -translate-y-1/2 hidden lg:block z-20 pointer-events-none">
          <div className="transform rotate-12">
            <div className="">
              <img src={ShopifyLogo} alt="Shopify" className="w-40 opacity-60" />
            </div>
          </div>
        </div>


        <div className="text-center max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            QR Code Review Software for Amazon & Shopify Sellers
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Collect honest customer feedback and product reviews using compliant QR codes.<br className="hidden md:block" />
            Fully Compliant with <span className="font-bold text-gray-900">Amazon</span> and <span className="font-bold text-gray-900">Shopify</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              to="/register"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white border-2 border-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            >
              Start Free
            </button>

            <a
              href="#contact-us"
              className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
            >
              Schedule a call
            </a>
          </div>


          {/* --- REVIEW CARDS (Images) --- */}
          <div className="relative mx-auto  mt-26">
            <div className="grid md:grid-cols-2 gap-8 items-center justify-items-center">
              {/* Left Card - Review Text */}
              <div className="">
                <img src={ReviewCard2} alt="Review Card" className="w-full max-w-lg opacity-80" />
              </div>

              {/* Right Card - Rating Stats */}
              <div className="mt-12">
                <img src={ReviewCard1} alt="Rating Summary" className="w-full max-w-lg opacity-80" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* --- PLATFORMS SECTION --- */}
      <section id="platforms" className="py-12 md:py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-500 font-medium mb-4 uppercase tracking-wider">Platforms</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Works with your favourite platforms
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto text-lg">
            Reviu works across leading ecommerce and marketplace platforms
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 mb-8">
            <img src={AmazonLogostraight} alt="Amazon" className="h-10  sm:h-12 object-contain " />
            <div className="flex items-center gap-2">
              <img src={ShopifyLogostraight} alt="Shopify" className="h-10 mb-2 sm:h-12 object-contain " />
            </div>
          </div>

          {/* <p className="text-gray-600 mb-10 font-medium">Works with Amazon, Shopify and leading ecommerce platforms.</p> */}

          <p className="text-gray-400 text-sm mb-10">more coming soon...</p>

          <Button
            to="/register"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
          >
            Start Free Now
          </Button>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="py-16 md:py-28" style={{ background: "#eef2ff" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-blue-500 font-semibold mb-3 uppercase tracking-widest text-sm">How it Works?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Three simple steps to better reviews</h2>
            <p className="text-gray-400 text-lg">Get started in minutes with our intuitive platform</p>
          </div>

          <div className="space-y-20 mb-20">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  1. Create a QR based feedback form
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Build a branded survey using Reviu's no-code editor. Share it via QR code or link.
                </p>
              </div>
              <div className=" border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
                <img src={Image1} alt="Create a QR based feedback form" className="w-full object-contain" style={{ maxHeight: 180, mixBlendMode: "multiply" }} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  2. Collect verified feedback
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Customers submit honest reviews after validating their purchase.
                </p>
              </div>
              <div className=" border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
                <img src={Image2} alt="Collect verified feedback" className="w-full object-contain" style={{ maxHeight: 180, mixBlendMode: "multiply" }} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  3. Analyse & automate
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Route feedback to your tools, track insights, and scale review collection effortlessly.
                </p>
              </div>
              <div className=" border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center" style={{ minHeight: 220 }}>
                <img src={Image3} alt="Analyse and automate" className="w-full object-contain" style={{ maxHeight: 180, mixBlendMode: "multiply" }} />
              </div>
            </div>
          </div>


          <div className="text-center">
            <Button
              to="/register"
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            >
              Start Free Now
            </Button>
          </div>
        </div>
      </section>

      {/* --- COMPLIANCE SECTION --- */}
      <section id="compliance" className="py-12 md:py-24 bg-gradient-to-b from-blue-50 to-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Built for platform compliance
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-xl">
            Reviu is designed to follow marketplace guidelines. Customers are encouraged to share honest feedback—positive or negative—without pressure or bias.
          </p>
          <p className="text-gray-600 mb-8 font-medium">Designed to comply with Amazon review and marketplace feedback policies.</p>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <FiShield size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Platform Compliant</h3>
              <p className="text-gray-500">Follows all marketplace guidelines</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <FiMessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unbiased Feedback</h3>
              <p className="text-gray-500">No pressure or sentiment-tied incentives</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <FiStar size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Honest Reviews</h3>
              <p className="text-gray-500">Positive or negative—we encourage authenticity</p>
            </div>
          </div>

          <div className="mt-16">
            <Button
              to="/register"
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            >
              Start Free Now
            </Button>
          </div>
        </div>
      </section>



      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-12 md:py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-500 font-medium mb-3 uppercase tracking-wider">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">High-quality reviews without high costs</h2>
          <p className="text-gray-500 text-xl mb-16 max-w-2xl mx-auto">
            Plan designed to help brands collect meaningful feedback at a cost that scales with growth.
          </p>

          <div className="bg-blue-600 text-white rounded-3xl p-8 max-w-sm mx-auto shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02] duration-300">
            <div className="text-left relative z-10">
              <h3 className="text-2xl font-bold mb-1">All in one</h3>
              <p className="text-blue-100 text-sm mb-8">Single pricing for all customers</p>

              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-bold">$25</span>
                <span className="text-blue-100 ml-2 font-medium">/ Month</span>
              </div>

              <div className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg mb-8 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                Get Started Now
              </div>

              <div className="space-y-4 text-left">
                {[
                  "Unlimited QR Campaigns",
                  "Amazon & Shopify Integration",
                  "Verified Review Collection",
                  "Custom Branding & Templates",
                  "Analytics Dashboard",
                  "24/7 Email Support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-white rounded-full p-0.5 mt-0.5 mr-3 flex-shrink-0">
                      <FiCheck className="text-blue-600 w-3 h-3" />
                    </div>
                    <span className="text-blue-50 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <Button
              to="/register"
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            >
              Start Free Now
            </Button>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-16 md:py-28 overflow-hidden relative" style={{ background: "#eef2ff" }}>
        {/* Star decorations */}
        <div style={{ position: "absolute", bottom: 40, left: 60, opacity: 0.18, fontSize: 80, color: "#6366f1", pointerEvents: "none", userSelect: "none" }}>★</div>
        <div style={{ position: "absolute", top: 60, left: 20, opacity: 0.10, fontSize: 60, color: "#6366f1", pointerEvents: "none", userSelect: "none" }}>★</div>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: headline + bullet stats ── */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Trusted by fast-growing<br />brands worldwide
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-sm">
              Used by D2C and marketplace sellers across Amazon &amp; Shopify
            </p>
            <ul className="space-y-3">
              {[
                "⭐ 4.7/5 average rating",
                "📈 3× increase in review rate",
                "🌍 Customers in 7+ countries( India, USA, Germany, Ireland & more)",
                "🔁 10,000+ reviews collected",
              ].map((stat, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-800 font-semibold text-base">
                  <span className="mt-0.5">•</span>
                  <span>{stat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: customer list panel + floating cards ── */}
          <div className="relative" style={{ minHeight: 420 }}>

            {/* Background image */}
            <img
              src={TestimonialBg}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "60%",
                borderRadius: 16,
                opacity: 0.85,
                pointerEvents: "none",
              }}
            />

            {/* Floating testimonial card image */}
            <img
              src={TestimonialImg}
              alt="Customer Testimonials"
              style={{
                position: "absolute",
                top: 10,
                right: 0,
                width: "70%",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                zIndex: 10,
              }}
            />

          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-12 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-500 text-xl">
              Everything you need to know about the product
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((item, i) => (
              <div
                key={i}
                className="border-b border-gray-100 pb-6"
              >
                <button
                  className="w-full flex justify-between items-start text-left focus:outline-none group"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <h4 className="text-lg font-semibold text-gray-900 pr-8">
                    {item.q}
                  </h4>
                  <span className="text-blue-500 text-2xl flex-shrink-0">
                    {openFaq === i ? (
                      <FiMinusCircle />
                    ) : (
                      <FiPlusCircle className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    )}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-gray-500 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact-us" className="py-12 md:py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img src={GetInTouchImg} alt="Get in touch" className="rounded-3xl shadow-2xl w-full object-cover" />
          </div>

          {/* Right Form */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Get in touch</h2>
            <p className="text-gray-500 mb-8 text-lg">Our friendly team would love to hear from you.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <div className="flex">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-3 py-3 rounded-l-lg border border-gray-400 border-r-0 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[120px]"
                  >
                    {[
                      { code: "+1", label: "US (+1)" },
                      { code: "+1", label: "CA (+1)" },
                      { code: "+44", label: "UK (+44)" },
                      { code: "+61", label: "AU (+61)" },
                      { code: "+49", label: "DE (+49)" },
                      { code: "+33", label: "FR (+33)" },
                      { code: "+91", label: "IN (+91)" },
                      { code: "+81", label: "JP (+81)" },
                      { code: "+86", label: "CN (+86)" },
                      { code: "+55", label: "BR (+55)" },
                      { code: "+971", label: "UAE (+971)" },
                      { code: "+65", label: "SG (+65)" },
                      { code: "+966", label: "SA (+966)" },
                    ].map((country, idx) => (
                      <option key={idx} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-r-lg bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                {/* <input type="checkbox" id="privacy" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-500">
                  You agree to our friendly <a href="#" className="underline">privacy policy</a>.
                </label> */}
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-70"
              >
                {status === "loading" ? "Sending..." : "Send message"}
              </Button>

              {status === "success" && (
                <p className="text-green-600 text-center font-medium">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-center font-medium">Failed to send message. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 pt-10 md:pt-16 pb-12 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={ReviuLogo} alt="Reviu" className="h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                More Reviews . More Trust . More Sales
              </h2>
            </div>

            <Button
              to="/register"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all whitespace-nowrap"
            >
              Start Free Now
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-12 border-t border-gray-100 pt-16">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-6">About Reviu.store</h3>
              <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
                Reviu helps brands collect honest, verified customer feedback through compliant surveys and automation—turning real customer voices into trust and growth.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors"><FiTwitter size={24} /></a>
                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors"><FiFacebook size={24} /></a>
                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors"><FiInstagram size={24} /></a>
                <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors"><FiGithub size={24} /></a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a></li>
                <li><a href="#integration" className="hover:text-blue-600 transition-colors">Integration</a></li>
                <li><a href="#compliance" className="hover:text-blue-600 transition-colors">Compliance</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Help</h3>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><a href="#contact-us" className="hover:text-blue-600 transition-colors">Contact us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div >
  );
}
