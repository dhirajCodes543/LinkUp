import React from 'react';
import { MessageCircle } from 'lucide-react';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                LinkUp
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Connecting tech students worldwide through secure, meaningful conversations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                <FaTwitter className="w-5 h-5 text-black dark:text-white" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                <FaGithub className="w-5 h-5 text-black dark:text-white" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                <Mail className="w-5 h-5 text-black dark:text-white" />
              </a>

            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 LinkUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
