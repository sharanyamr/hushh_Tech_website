import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGlobe, FaAt, FaRss, FaPhone } from "react-icons/fa";
import HushhLogo from "./images/Hushhogo.png";
import { useAuthSession } from "../auth/AuthSessionProvider";

export default function Footer() {
  const { status } = useAuthSession();
  const isLoggedIn = status === "authenticated";

  // Function to handle PDF download
  const handleDownload = (pdfPath: string) => {
    if (isLoggedIn) {
      const link = document.createElement("a");
      link.href = pdfPath;
      link.download = pdfPath.split("/").pop() || "download";
      link.click();
    } else {
      toast.error("Please log in first to access this content.");
    }
  };

  return (
    <footer className="relative z-10 bg-[#0B0C10] border-t border-[#1F2937]">
      {/* Top Section: Identity & Contact */}
      <div className="px-6 pt-10 pb-6 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 text-white">
            {/* Hushh Logo */}
            <img 
              src={HushhLogo} 
              alt="Hushh Logo" 
              className="w-10 h-10 object-contain"
            />
            <h2 className="tracking-tight text-[22px] font-extrabold leading-tight">
              Hushh 🤫 Technologies LLC
            </h2>
          </div>
          <p className="text-gray-400 text-base font-medium leading-relaxed max-w-[80%]">
            1021 5th St W, Kirkland, WA 98033
          </p>
        </div>

        {/* Contact Action Panel */}
        <div className="rounded-xl border border-[#1F2937] bg-[#161d2b] p-5 flex flex-col gap-4 shadow-sm mb-8">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <a 
                href="tel:+18884621726" 
                className="text-white text-lg font-bold leading-tight hover:text-[#135bec] transition-colors flex items-center gap-2"
              >
                (888) 462-1726
              </a>
              <p className="text-[#9da6b9] text-sm font-normal">
                Mon-Fri: 9AM-6PM PST
              </p>
            </div>
            <div className="bg-[#135bec]/20 p-2 rounded-full">
              <FaPhone className="text-[#135bec]" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Navigation Stack */}
      <div className="px-6 pb-6 grid gap-8 max-w-7xl mx-auto md:grid-cols-2">
        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white tracking-wide text-sm uppercase font-bold text-opacity-80">
            Quick Links
          </h3>
          <nav className="flex flex-col gap-0 border-l border-[#1F2937] pl-4">
            <div className="grid grid-cols-2 gap-x-8">
              <div className="space-y-0">
                <a 
                  href="/about/leadership" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  About Us
                </a>
                <a 
                  href="/discover-fund-a" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  Fund A
                </a>
                <a 
                  href="https://www.hushh.ai/solutions" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  Solutions
                </a>
                <a 
                  href="/benefits" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  Benefits
                </a>
                <a 
                  href="/careers" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  Careers
                </a>
              </div>
              <div className="space-y-0">
                <a 
                  href="/community" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  Community
                </a>
                <a 
                  href="/faq" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  FAQ
                </a>
                <a 
                  href="/contact" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  Contact
                </a>
                <a 
                  href="/kyc-verification" 
                  className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group block transition-colors duration-200"
                >
                  KYC Verification
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white tracking-wide text-sm uppercase font-bold text-opacity-80">
            Legal
          </h3>
          <nav className="flex flex-col gap-0 border-l border-[#1F2937] pl-4">
            <a 
              href="/privacy-policy" 
              className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group transition-colors duration-200"
            >
              Website Privacy Policy
            </a>
            <a 
              href="/eu-uk-jobs-privacy-policy" 
              className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group transition-colors duration-200"
            >
              EU and UK Privacy Policies
            </a>
            <a 
              href="/california-privacy-policy" 
              className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group transition-colors duration-200"
            >
              California Privacy Policy
            </a>
            <a 
              href="/carrer-privacy-policy" 
              className="py-2 text-gray-300 hover:text-white text-base font-medium flex items-center justify-between group transition-colors duration-200"
            >
              Careers Site Privacy Notice
            </a>
          </nav>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#1F2937]"></div>

      {/* Bottom Section: Regulatory & Social */}
      <div className="px-6 pt-8 pb-12 max-w-7xl mx-auto">
        {/* Social Media */}
        <div className="flex gap-4 mb-8">
          <a 
            href="https://www.hushh.ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#135bec] transition-colors group"
          >
            <FaGlobe className="text-gray-400 group-hover:text-white text-base" />
          </a>
          <a 
            href="mailto:support@hushh.ai" 
            className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#135bec] transition-colors group"
          >
            <FaAt className="text-gray-400 group-hover:text-white text-base" />
          </a>
          <a 
            href="/community" 
            className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center hover:bg-[#135bec] transition-colors group"
          >
            <FaRss className="text-gray-400 group-hover:text-white text-base" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-sm font-normal mb-4">
          © 2025 Hushh All Rights Reserved.
        </p>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-[#161d2b]/50 border border-[#1F2937]/50">
          <p className="text-gray-300 text-xs leading-5">
            <span className="font-bold text-gray-200">Disclaimer:</span> Investment involves risk, including the possible loss of principal. Past performance does not guarantee future results. Please consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </div>

      {/* Safe Area Spacer for iOS Home Indicator */}
      <div className="h-6 w-full"></div>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </footer>
  );
}
