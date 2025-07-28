'use client';

import Image from 'next/image';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.story.content1')}
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.story.content2')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600">
                    {t('about.story.peopleServed')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">50+</div>
                  <div className="text-sm text-gray-600">
                    {t('about.story.programs')}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:text-right">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {t('about.purpose.title')}
                </h3>
                <p className="text-lg leading-relaxed">
                  {t('about.purpose.content')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.missionVision.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission')}</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'समाज के कमजोर वर्गों की सेवा करना' : 'Serving the weaker sections of society'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'शिक्षा और स्वास्थ्य के क्षेत्र में काम करना' : 'Working in the fields of education and health'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'पर्यावरण संरक्षण के लिए जागरूकता फैलाना' : 'Spreading awareness for environmental conservation'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'युवाओं को सामाजिक कार्यों से जोड़ना' : 'Connecting youth with social work'}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision')}</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'एक न्यायसंगत और समान समाज का निर्माण' : 'Building a just and equal society'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'शिक्षा और स्वास्थ्य का सभी के लिए पहुंच' : 'Access to education and health for all'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'पर्यावरण के साथ सामंजस्य में जीवन' : 'Life in harmony with the environment'}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {language === 'hi' ? 'सभी के लिए गरिमापूर्ण जीवन' : 'Dignified life for all'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.workAreas.title')}</h2>
            <p className="text-xl text-gray-600">{t('about.workAreas.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.workAreas.education.title')}</h3>
              <p className="text-gray-600">{t('about.workAreas.education.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.workAreas.health.title')}</h3>
              <p className="text-gray-600">{t('about.workAreas.health.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.workAreas.environment.title')}</h3>
              <p className="text-gray-600">{t('about.workAreas.environment.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.workAreas.community.title')}</h3>
              <p className="text-gray-600">{t('about.workAreas.community.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.team.title')}</h2>
            <p className="text-xl text-gray-600">{t('about.team.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AS</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.team.founder.name')}</h3>
              <p className="text-orange-600 font-semibold mb-3">{t('about.team.founder.role')}</p>
              <p className="text-gray-600">{t('about.team.founder.description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">PS</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.team.director.name')}</h3>
              <p className="text-orange-600 font-semibold mb-3">{t('about.team.director.role')}</p>
              <p className="text-gray-600">{t('about.team.director.description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">RK</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.team.coordinator.name')}</h3>
              <p className="text-orange-600 font-semibold mb-3">{t('about.team.coordinator.role')}</p>
              <p className="text-gray-600">{t('about.team.coordinator.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('about.cta.title')}</h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              {t('about.cta.volunteer')}
            </a>
            <a
              href="#"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              {t('about.cta.donate')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
