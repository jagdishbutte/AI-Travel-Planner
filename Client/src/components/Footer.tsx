import { Link } from "react-router-dom";
import {
  FacebookIcon,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    {
      icon: FacebookIcon,
      href: "https://facebook.com/travelai",
      label: "Facebook",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/travelai",
      label: "Twitter",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/travelai",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/travelai",
      label: "LinkedIn",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/travelai",
      label: "YouTube",
    },
  ];

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Travel Guide", href: "/guide" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faqs" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ];

  return (
    <footer className="bg-gray-800/50 border-t border-gray-700 mt-16 mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4 justify-center md:justify-start">
              <Globe className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">TravelAI</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your AI-powered travel companion, making travel planning smarter
              and more personalized.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-center md:text-left">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-center md:text-left">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-center md:text-left">
              <div className="flex text-gray-300 justify-center md:justify-start">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                <address className="text-sm not-italic">
                  Zeal Teck Park, Narhe
                  <br />
                  Pune, Maharashtra 411001
                  <br />
                  India
                </address>
              </div>
              <div className="flex items-center text-gray-300 justify-center md:justify-start">
                <Phone className="h-5 w-5 mr-2 text-blue-500" />
                <a
                  href="tel:+919876543210"
                  className="text-sm hover:text-white transition-colors"
                >
                  +91 78882 42084
                </a>
              </div>
              <div className="flex items-center text-gray-300 justify-center md:justify-start">
                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                <a
                  href="mailto:support@travelai.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  aidventuretravels@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TravelAI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">Made with ❤️ in India</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
