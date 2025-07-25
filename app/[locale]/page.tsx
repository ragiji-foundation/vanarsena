'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Home() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'hi';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl mb-4 text-orange-100">
                {t('hero.subtitle')}
              </p>
              <p className="text-lg mb-8 text-gray-200">
                {language === 'hi' 
                  ? 'हमारे साथ जुड़िए और समाज में सकारात्मक बदलाव लाइए। हर छोटा कदम एक बड़े बदलाव की शुरुआत है।'
                  : 'Join us and make a positive change in society. Every small step is the beginning of a big change.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${currentLocale}/events`}
                  className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-center"
                >
                  {t('hero.cta.events')}
                </Link>
                <Link
                  href={`/${currentLocale}/about`}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors text-center"
                >
                  {t('about.readMore')}
                </Link>
              </div>
            </div>
            <div className="lg:text-right">
              <div className="inline-block bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm opacity-90">
                      {language === 'hi' ? 'सेवा किए गए लोग' : 'People Served'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-sm opacity-90">
                      {language === 'hi' ? 'कार्यक्रम' : 'Events'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">25+</div>
                    <div className="text-sm opacity-90">
                      {language === 'hi' ? 'स्वयंसेवक' : 'Volunteers'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">5+</div>
                    <div className="text-sm opacity-90">
                      {language === 'hi' ? 'वर्षों का अनुभव' : 'Years Experience'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? 'हमारा मिशन और दृष्टिकोण' : 'Our Mission and Vision'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'hi' 
                ? 'समाज में सकारात्मक बदलाव लाना और जरूरतमंदों की सेवा करना हमारा मुख्य उद्देश्य है'
                : 'Our main goal is to bring positive change in society and serve those in need'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'hi' 
                  ? 'समाज के कमजोर वर्गों की सेवा करना, शिक्षा और स्वास्थ्य के क्षेत्र में काम करना, और पर्यावरण संरक्षण के लिए जागरूकता फैलाना।'
                  : 'Serving the weaker sections of society, working in the fields of education and health, and spreading awareness for environmental conservation.'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'hi' 
                  ? 'एक ऐसा समाज बनाना जहाँ हर व्यक्ति को शिक्षा, स्वास्थ्य और गरिमा के साथ जीने का अधिकार हो और सभी मिलकर एक बेहतर भविष्य का निर्माण करें।'
                  : 'To create a society where every person has the right to live with education, health and dignity, and together build a better future.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('events.upcoming')}
              </h2>
              <p className="text-xl text-gray-600">
                {language === 'hi' 
                  ? 'हमारे आने वाले कार्यक्रमों में भाग लें'
                  : 'Participate in our upcoming events'
                }
              </p>
            </div>
            <Link
              href="/events"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              {language === 'hi' ? 'सभी कार्यक्रम देखें' : 'View All Events'}
            </Link>
          </div>

          {/* Sample Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500"></div>
                <div className="p-6">
                  <div className="text-sm text-orange-600 font-semibold mb-2">
                    {language === 'hi' ? '15 अगस्त 2025' : 'August 15, 2025'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {language === 'hi' ? 'स्वतंत्रता दिवस समारोह' : 'Independence Day Celebration'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'hi' 
                      ? 'राष्ट्रीय पर्व के अवसर पर विशेष कार्यक्रम का आयोजन।'
                      : 'Special event organized on the occasion of the national festival.'
                    }
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {language === 'hi' ? 'नई दिल्ली' : 'New Delhi'}
                  </div>
                  <Link
                    href={`/events/independence-day-celebration`}
                    className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                  >
                    {t('events.readMore')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {language === 'hi' ? 'हमारे साथ जुड़ें' : 'Join Us'}
          </h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'आपका योगदान हमारे मिशन को और मजबूत बनाता है। आज ही हमसे जुड़ें और समाज सेवा में भाग लें।'
              : 'Your contribution strengthens our mission. Join us today and participate in social service.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              {t('hero.cta.volunteer')}
            </Link>
            <a
              href="#"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              {t('hero.cta.donate')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
