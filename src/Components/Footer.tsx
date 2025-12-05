import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">WanderVoyage</h3>
            <p className="text-sm mb-4 opacity-90">
              Your trusted travel partner for creating unforgettable vacation experiences across the world's most amazing destinations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Luxury Packages
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Adventure Tours
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Family Vacations
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Honeymoon Getaways
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>456 Paradise Avenue, Travel City, TC 78901</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>+1 (800) 555-TRIP</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>hello@wandervoyage.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} WanderVoyage Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;