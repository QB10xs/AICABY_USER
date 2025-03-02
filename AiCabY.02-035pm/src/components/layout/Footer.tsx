import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';
import { scrollToElement } from '@/utils/scroll';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleDocumentationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/driver');
    setTimeout(() => scrollToElement('documentation'), 100);
  };
  return (
    <footer className="bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">AiCabY</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Your AI-powered taxi experience. Fast, reliable, and always available.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" onClick={handleDocumentationClick} className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" onClick={handleDocumentationClick} className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" onClick={handleDocumentationClick} className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" onClick={handleDocumentationClick} className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" onClick={handleDocumentationClick} className="text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@aicaby.com"
                  className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  support@aicaby.com
                </a>
              </li>
              <li>
                <Link 
                  to="/driver#documentation"
                  className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm">
            © {new Date().getFullYear()} AI CABY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
