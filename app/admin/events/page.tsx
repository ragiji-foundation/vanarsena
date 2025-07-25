'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface Event {
  id: number;
  slug: string;
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  event_date: string;
  event_time: string;
  location: string;
  published: boolean;
  featured_image: string | null;
  created_at: string;
}

export default function EventsManagement() {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    
    fetchEvents();
  }, [filter, session, status, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/admin/events?filter=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === 'hi' ? 'क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?' : 'Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event.id !== id));
      } else {
        alert(language === 'hi' ? 'कार्यक्रम हटाने में त्रुटि' : 'Error deleting event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(language === 'hi' ? 'कार्यक्रम हटाने में त्रुटि' : 'Error deleting event');
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/events/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === id ? { ...event, published: !currentStatus } : event
        ));
      } else {
        alert(language === 'hi' ? 'स्थिति बदलने में त्रुटि' : 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert(language === 'hi' ? 'स्थिति बदलने में त्रुटि' : 'Error updating status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US');
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'published') return event.published;
    if (filter === 'draft') return !event.published;
    return true;
  });

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {language === 'hi' ? 'कार्यक्रम प्रबंधन' : 'Events Management'}
            </h1>
            <Link
              href="/admin/events/new"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {language === 'hi' ? 'नया कार्यक्रम' : 'New Event'}
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              {[
                { key: 'all', label: language === 'hi' ? 'सभी' : 'All' },
                { key: 'published', label: language === 'hi' ? 'प्रकाशित' : 'Published' },
                { key: 'draft', label: language === 'hi' ? 'मसौदा' : 'Draft' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`${
                    filter === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Events List */}
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {language === 'hi' ? 'कोई कार्यक्रम नहीं' : 'No events'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {language === 'hi' ? 'नया कार्यक्रम बनाने के लिए शुरू करें।' : 'Get started by creating a new event.'}
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/events/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    {language === 'hi' ? 'नया कार्यक्रम' : 'New Event'}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <li key={event.id}>
                      <div className="px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          {event.featured_image && (
                            <img
                              className="h-16 w-16 object-cover rounded-lg mr-4"
                              src={event.featured_image}
                              alt=""
                            />
                          )}
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {language === 'hi' ? event.title_hi : event.title_en}
                              </p>
                              <span
                                className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  event.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {event.published 
                                  ? (language === 'hi' ? 'प्रकाशित' : 'Published')
                                  : (language === 'hi' ? 'मसौदा' : 'Draft')
                                }
                              </span>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <p>
                                {formatDate(event.event_date)} - {event.location}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            {language === 'hi' ? 'संपादित करें' : 'Edit'}
                          </Link>
                          <button
                            onClick={() => togglePublish(event.id, event.published)}
                            className={`text-sm font-medium ${
                              event.published
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {event.published 
                              ? (language === 'hi' ? 'अप्रकाशित करें' : 'Unpublish')
                              : (language === 'hi' ? 'प्रकाशित करें' : 'Publish')
                            }
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            {language === 'hi' ? 'हटाएं' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
