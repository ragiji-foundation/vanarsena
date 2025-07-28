'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalMedia: number;
  contactSubmissions: number;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    totalMedia: 0,
    contactSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedingMessage, setSeedingMessage] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm(language === 'hi' 
      ? 'क्या आप वाकई डेटाबेस में नमूना डेटा जोड़ना चाहते हैं? यह कुछ नमूना कार्यक्रम, संपर्क संदेश और मीडिया फाइलें जोड़ेगा।'
      : 'Are you sure you want to seed the database with sample data? This will add some sample events, contact messages, and media files.')) {
      return;
    }

    setSeeding(true);
    setSeedingMessage(language === 'hi' ? 'डेटा जोड़ा जा रहा है...' : 'Seeding data...');

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSeedingMessage(
          language === 'hi' 
            ? 'डेटाबेस सफलतापूर्वक सीड किया गया!'
            : 'Database seeded successfully!'
        );
        // Refresh stats
        fetchDashboardStats();
        setTimeout(() => setSeedingMessage(''), 5000);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to seed data');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      setSeedingMessage(language === 'hi' ? 'डेटा जोड़ने में त्रुटि' : 'Error seeding data');
      setTimeout(() => setSeedingMessage(''), 5000);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: language === 'hi' ? 'कुल कार्यक्रम' : 'Total Events',
      value: stats.totalEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: language === 'hi' ? 'प्रकाशित कार्यक्रम' : 'Published Events',
      value: stats.publishedEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: language === 'hi' ? 'मसौदा कार्यक्रम' : 'Draft Events',
      value: stats.draftEvents,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      title: language === 'hi' ? 'मीडिया फाइलें' : 'Media Files',
      value: stats.totalMedia,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: language === 'hi' ? 'संपर्क संदेश' : 'Contact Messages',
      value: stats.contactSubmissions,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                  {statCards.map((card, index) => (
                    <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`${card.color} p-3 rounded-md text-white`}>
                              {card.icon}
                            </div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {card.title}
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                {card.value}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {language === 'hi' ? 'त्वरित कार्य' : 'Quick Actions'}
                  </h2>
                  
                  {/* Seed Data Button */}
                  <button
                    onClick={handleSeedData}
                    disabled={seeding}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    {seeding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{language === 'hi' ? 'जोड़ा जा रहा है...' : 'Seeding...'}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                        </svg>
                        <span>{language === 'hi' ? 'नमूना डेटा जोड़ें' : 'Seed Sample Data'}</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Seed Status Message */}
                {seedingMessage && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    {seedingMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <a
                    href="/admin/events/new"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-300"
                  >
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {language === 'hi' ? 'नया कार्यक्रम' : 'New Event'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'कार्यक्रम जोड़ें' : 'Add an event'}
                        </p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/admin/media"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-300"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {language === 'hi' ? 'मीडिया अपलोड' : 'Upload Media'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'फाइल अपलोड करें' : 'Upload files'}
                        </p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/admin/events"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-300"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {language === 'hi' ? 'कार्यक्रम प्रबंधन' : 'Manage Events'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'सभी कार्यक्रम देखें' : 'View all events'}
                        </p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/admin/settings"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-300"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {language === 'hi' ? 'साइट सेटिंग्स' : 'Site Settings'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'सेटिंग्स बदलें' : 'Update settings'}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
