import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AmazonLogo from "../assets/Amazon logo.png";
import ShopifyLogo from "../assets/shopify.png";
import ReviuLogo from "../assets/Reviu_Logo.png";
import Button from "../components/base/Button";
import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import { FiShield, FiMessageSquare, FiStar, FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import LogoDevPunya from "../assets/logo_devpunya.png";
import LogoOoge from "../assets/logo_ooge.png";
import TestimonialBg from "../assets/testimonia_background.png";
import TestimonialImg from "../assets/testimonail.png";
import GetInTouchImg from "../assets/get_in_touch.png";

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

const ReviewCard = () => (
  <div className="relative bg-white p-6 rounded-xl shadow-lg border border-blue-50 transform rotate-[-3deg] z-10 max-w-sm">
    <div className="flex space-x-1 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className="w-5 h-5 text-blue-500 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">
      Performs its task perfectly
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed mb-4">
      Good quality, Average good cable length, Good strength, looks like the
      image exact, and the experience is good as well.
    </p>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        {/* Placeholder avatar or initial */}
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yashasvi"
          alt="User"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">Yashasvi</p>
        <p className="text-xs text-gray-500">29 Oct, 2025</p>
      </div>
    </div>
  </div>
);

const RatingCard = () => (
  <div className="relative bg-white p-6 rounded-xl shadow-lg border border-blue-50 transform rotate-[3deg] z-10 max-w-sm ml-auto mt-8 md:mt-0">
    <div className="flex items-start justify-between">
      <div>
        <span className="text-5xl font-bold text-gray-900">4.5</span>
        <p className="text-xs text-gray-400 mt-1">1240 reviews</p>
      </div>
      <div className="flex flex-col space-y-1 w-32">
        {[5, 4, 3, 2, 1].map((num) => (
          <div key={num} className="flex items-center text-xs">
            <span className="w-3 mr-1">{num}</span>
            <span className="text-blue-500 mr-1">★</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: num === 5 ? '70%' : num === 4 ? '20%' : num === 3 ? '5%' : num === 2 ? '3%' : '2%'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState(0);

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
      {/* Background Grid Lines (Decorative) */}
      <div className="absolute inset-x-0 top-[20%] border-t border-dashed border-blue-200 opacity-50"></div>
      <div className="absolute inset-y-0 left-1/4 border-r border-dashed border-blue-200 opacity-50 hidden lg:block"></div>
      <div className="absolute inset-y-0 right-1/4 border-r border-dashed border-blue-200 opacity-50 hidden lg:block"></div>


      {/* --- HEADER --- */}
      {!localStorage.getItem("token") && <NavBar />}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-32 text-center max-w-5xl mx-auto px-6 z-10">

        {/* Amazon Logo Floating Left */}
        {/* Amazon Logo Floating Left */}
        <div className="absolute top-1/2 left-0 md:-left-12 -translate-y-1/2 hidden lg:block z-20 pointer-events-none">
          <div className="transform -rotate-12">
            <div className="animate-float-slow">
              <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 w-40">
                <img src={AmazonLogo} alt="Amazon" className="w-full opacity-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Shopify Logo Floating Right */}
        <div className="absolute top-2/3 right-0 md:-right-4 -translate-y-1/2 hidden lg:block z-20 pointer-events-none">
          <div className="transform rotate-12">
            <div className="animate-float-slower">
              <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 w-36 flex items-center justify-center">
                <img src={ShopifyLogo} alt="Shopify" className="w-full opacity-90" />
              </div>
            </div>
          </div>
        </div>


        <h1 className="text-5xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          QR Code Review Software for Amazon & Shopify Sellers
        </h1>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Collect honest customer feedback and product reviews using compliant QR codes.<br className="hidden md:block" />
          Fully Compliant with <span className="font-bold text-gray-900">Amazon</span> and <span className="font-bold text-gray-900">Shopify</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button
            to="/register"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
          >
            Start Free
          </Button>
          <Button
            href="#schedule"
            className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600"
          >
            Schedule a call
          </Button>
        </div>

        {/* --- FEATURE PREVIEW CARDS (Bottom Box) --- */}
        <div className="relative mx-auto max-w-4xl">
          {/* The box border effect */}
          <div className="absolute inset-0 border-2 border-blue-400 opacity-20 rounded-xl pointer-events-none"></div>

          <div className="grid md:grid-cols-2 gap-10 p-10 items-center">
            <ReviewCard />
            <RatingCard />
          </div>
        </div>

      </section>

      {/* --- PLATFORMS SECTION --- */}
      <section id="platforms" className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-500 font-medium mb-4">Platforms</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Works with your favourite platforms
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            Reviu works across leading ecommerce and marketplace platforms
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 mb-8">
            <img src={AmazonLogo} alt="Amazon" className="h-10 sm:h-12 object-contain" />
            <div className="flex items-center gap-2">
              <img src={ShopifyLogo} alt="Shopify" className="h-10 sm:h-12 object-contain" />
              <span className="text-2xl font-bold font-sans text-gray-800">shopify</span>
            </div>
          </div>

          <p className="text-gray-600 mb-10 font-medium">Works with Amazon, Shopify and leading ecommerce platforms.</p>

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
      <section id="how-it-works" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-blue-500 font-semibold mb-3">How it Works?</h4>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Three simple steps to better reviews</h2>
          <p className="text-gray-500 mb-16 text-lg">Get started in minutes with our intuitive platform</p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-2xl p-6 mb-8 w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img src={Image1} alt="Create a feedback flow" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create a feedback flow</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                Create a QR-based post-purchase review flow for your product.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-2xl p-6 mb-8 w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img src={Image2} alt="Collect verified feedback" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collect verified feedback</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                Customers scan the QR code to share feedback or leave a marketplace review through smart funnel.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-2xl p-6 mb-8 w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
                <img src={Image3} alt="Analyse & automate" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analyse & automate</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                Track customer reviews and insights to improve listings and buyer experience.
              </p>
            </div>
          </div>

          <Button
            to="/register"
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
          >
            Start Free Now
          </Button>
        </div>
      </section>

      {/* --- COMPLIANCE SECTION --- */}
      <section id="compliance" className="py-24 bg-gradient-to-b from-blue-50 to-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built for platform compliance
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">
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
      <section id="pricing" className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
          <p className="text-gray-500 text-lg mb-8">
            Simple pricing for Amazon and Shopify sellers collecting reviews via QR codes.
          </p>
          {/* Detailed pricing cards can go here */}
          <div className="p-8 border rounded-xl bg-gray-50 inline-block">
            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <p className="text-gray-500">Everything you need to grow.</p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 bg-[#F4F8FF] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Loved By Brands</h2>
            <p className="text-gray-500 text-lg mb-12 max-w-lg">
              See what our customers have to say about their experience with Reviu
            </p>

            <div className="flex items-center gap-8">
              <img src={LogoDevPunya} alt="DevPunya" className="h-10 object-contain" />
              <img src={LogoOoge} alt="OOGE" className="h-10 object-contain" />
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Background Decorative */}
            <img
              src={TestimonialBg}
              alt=""
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none opacity-80 pointer-events-none"
            />

            {/* Front Card */}
            <img
              src={TestimonialImg}
              alt="Customer Testimonials"
              className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-500 text-lg">
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
      <section id="contact-us" className="py-24 bg-[#F4F8FF]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img src={GetInTouchImg} alt="Get in touch" className="rounded-3xl shadow-2xl w-full object-cover" />
          </div>

          {/* Right Form */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Get in touch</h2>
            <p className="text-gray-500 mb-8">Our friendly team would love to hear from you.</p>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input type="text" placeholder="First name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input type="text" placeholder="Last name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <div className="flex">
                  <select className="px-3 py-3 rounded-l-lg border border-r-0 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>US</option>
                  </select>
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="privacy" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-500">
                  You agree to our friendly <a href="#" className="underline">privacy policy</a>.
                </label>
              </div>

              <Button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all"
              >
                Send message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* --- Footer / Extra (Minimal for now to match screenshot focus) --- */}
      <div className="text-center pb-8 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Reviu. All rights reserved.</p>
      </div>

    </div >
  );
}
