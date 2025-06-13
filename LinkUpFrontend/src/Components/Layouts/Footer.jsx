import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail } from 'lucide-react';

// Lazy‑load FontAwesome icons
const FaGithub = lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaGithub })));
const FaInstagram = lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaInstagram })));

export default function Footer() {
  return (
    <footer
      id="contact"
      className="py-12 bg-gray-900 border-t border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                LinkUp
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting tech students worldwide through secure, meaningful conversations.
            </p>
            <div className="flex space-x-4">
              {/* Instagram */}
              <Suspense fallback={<div className="w-5 h-5" />}>
                <a
                  href="https://www.instagram.com/ddra890/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <FaInstagram className="w-5 h-5 text-white" />
                </a>
              </Suspense>
              {/* Mail */}
              <a
                href="mailto:support@linkup.com"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              {/* GitHub */}
              <Suspense fallback={<div className="w-5 h-5" />}>
                <a
                  href="https://github.com/dhirajCodes543"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <FaGithub className="w-5 h-5 text-white" />
                </a>
              </Suspense>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-100">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Benefits', 'Testimonials'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-100">Support</h3>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">© 2025 LinkUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
