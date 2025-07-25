'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <h3 className="text-xl font-bold">
                {language === 'hi' ? 'वानरसेना' : 'VanarSena'}
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              {language === 'hi' 
                ? 'समाज सेवा के लिए प्रतिबद्ध एक गैर-सरकारी संगठन। हमारा उद्देश्य समाज में सकारात्मक बदलाव लाना और जरूरतमंदों की सेवा करना है।'
                : 'A non-governmental organization committed to social service. Our goal is to bring positive change in society and serve those in need.'
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.228 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.65-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.821.228 14.189.06 13.122.012 12.782 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.events')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {language === 'hi' ? 'दान करें' : 'Donate'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="block">
                  {language === 'hi' ? 'ईमेल:' : 'Email:'}
                </span>
                <a href="mailto:contact@vanarsena.org" className="hover:text-white transition-colors">
                  contact@vanarsena.org
                </a>
              </li>
              <li>
                <span className="block">
                  {language === 'hi' ? 'फोन:' : 'Phone:'}
                </span>
                <a href="tel:+91-XXXXXXXXXX" className="hover:text-white transition-colors">
                  +91-XXXXXXXXXX
                </a>
              </li>
              <li>
                <span className="block">
                  {language === 'hi' ? 'पता:' : 'Address:'}
                </span>
                <span>
                  {language === 'hi' ? 'वानरसेना कार्यालय, भारत' : 'VanarSena Office, India'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {language === 'hi' 
                ? '© 2025 वानरसेना। सभी अधिकार सुरक्षित।'
                : '© 2025 VanarSena. All rights reserved.'
              }
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {language === 'hi' ? 'नियम एवं शर्तें' : 'Terms & Conditions'}
              </a>
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">Developed and Maintained by</span>
              <a
                href="https://www.octavertexmedia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://www.octavertexmedia.com/logo/octavertex-logo.png"
                  alt="OctacVertex Media"
                  className="h-6 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
