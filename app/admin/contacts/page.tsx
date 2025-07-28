'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  submitted_at: string;
}

export default function ContactsPage() {
  const { language } = useLanguage();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Update local state
        setContacts(prev => 
          prev.map(contact => 
            contact.id === id ? { ...contact, status: status as any } : contact
          )
        );
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm(language === 'hi' 
      ? 'क्या आप वाकई इस संदेश को हटाना चाहते हैं?'
      : 'Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact.id !== id));
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(null);
        }
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filterStatus === 'all') return true;
    return contact.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread':
        return language === 'hi' ? 'अपठित' : 'Unread';
      case 'read':
        return language === 'hi' ? 'पढ़ा गया' : 'Read';
      case 'replied':
        return language === 'hi' ? 'उत्तर दिया गया' : 'Replied';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {language === 'hi' ? 'संपर्क संदेश' : 'Contact Messages'}
            </h1>
            
            {/* Filter Dropdown */}
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">
                  {language === 'hi' ? 'सभी संदेश' : 'All Messages'}
                </option>
                <option value="unread">
                  {language === 'hi' ? 'अपठित' : 'Unread'}
                </option>
                <option value="read">
                  {language === 'hi' ? 'पढ़ा गया' : 'Read'}
                </option>
                <option value="replied">
                  {language === 'hi' ? 'उत्तर दिया गया' : 'Replied'}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Contact List */}
              <div className="w-1/2">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {language === 'hi' ? 'कोई संदेश नहीं' : 'No messages'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {language === 'hi' 
                            ? 'अभी तक कोई संपर्क संदेश प्राप्त नहीं हुआ है।'
                            : 'No contact messages have been received yet.'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                              selectedContact?.id === contact.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                            }`}
                            onClick={() => {
                              setSelectedContact(contact);
                              if (contact.status === 'unread') {
                                updateContactStatus(contact.id, 'read');
                              }
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                                {getStatusText(contact.status)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-2">{contact.subject}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatDate(contact.submitted_at)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Detail */}
              <div className="w-1/2">
                {selectedContact ? (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          {language === 'hi' ? 'संदेश विवरण' : 'Message Details'}
                        </h2>
                        <div className="flex space-x-2">
                          <select
                            value={selectedContact.status}
                            onChange={(e) => updateContactStatus(selectedContact.id, e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="unread">
                              {language === 'hi' ? 'अपठित' : 'Unread'}
                            </option>
                            <option value="read">
                              {language === 'hi' ? 'पढ़ा गया' : 'Read'}
                            </option>
                            <option value="replied">
                              {language === 'hi' ? 'उत्तर दिया गया' : 'Replied'}
                            </option>
                          </select>
                          <button
                            onClick={() => deleteContact(selectedContact.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title={language === 'hi' ? 'हटाएं' : 'Delete'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'नाम' : 'Name'}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{selectedContact.name}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'ईमेल' : 'Email'}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            <a href={`mailto:${selectedContact.email}`} className="text-orange-600 hover:text-orange-800">
                              {selectedContact.email}
                            </a>
                          </p>
                        </div>

                        {selectedContact.phone && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              {language === 'hi' ? 'फ़ोन' : 'Phone'}
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                              <a href={`tel:${selectedContact.phone}`} className="text-orange-600 hover:text-orange-800">
                                {selectedContact.phone}
                              </a>
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'विषय' : 'Subject'}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{selectedContact.subject}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'संदेश' : 'Message'}
                          </label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'प्राप्त किया गया' : 'Received'}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(selectedContact.submitted_at)}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <a
                            href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {language === 'hi' ? 'उत्तर दें' : 'Reply'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {language === 'hi' ? 'कोई संदेश चयनित नहीं' : 'No message selected'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {language === 'hi' 
                          ? 'विवरण देखने के लिए किसी संदेश पर क्लिक करें।'
                          : 'Click on a message to view its details.'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
