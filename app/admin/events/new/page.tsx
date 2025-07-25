'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/admin/AdminLayout';
import RichTextEditor from '../../../../components/admin/RichTextEditor';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface EventFormData {
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  meta_title_hi: string;
  meta_title_en: string;
  meta_description_hi: string;
  meta_description_en: string;
  event_date: string;
  event_time: string;
  location: string;
  tags: string[];
  published: boolean;
  featured_image: string;
}

export default function NewEventPage() {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState<'hi' | 'en'>('hi');
  
  const [formData, setFormData] = useState<EventFormData>({
    title_hi: '',
    title_en: '',
    description_hi: '',
    description_en: '',
    meta_title_hi: '',
    meta_title_en: '',
    meta_description_hi: '',
    meta_description_en: '',
    event_date: '',
    event_time: '',
    location: '',
    tags: [],
    published: false,
    featured_image: '',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  const handleInputChange = (field: keyof EventFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = generateSlug(formData.title_en || formData.title_hi);
      
      const eventData = {
        ...formData,
        slug,
      };

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        router.push('/admin/events');
      } else {
        const error = await response.text();
        alert(language === 'hi' ? 'कार्यक्रम सहेजने में त्रुटि' : 'Error saving event: ' + error);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert(language === 'hi' ? 'कार्यक्रम सहेजने में त्रुटि' : 'Error saving event');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {language === 'hi' ? 'नया कार्यक्रम बनाएं' : 'Create New Event'}
            </h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              {language === 'hi' ? 'वापस' : 'Back'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Language Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setCurrentTab('hi')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === 'hi'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('en')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === 'en'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  English
                </button>
              </nav>
            </div>

            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {language === 'hi' ? 'मूल जानकारी' : 'Basic Information'}
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'कार्यक्रम की तारीख' : 'Event Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'कार्यक्रम का समय' : 'Event Time'}
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleInputChange('event_time', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'स्थान' : 'Location'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={language === 'hi' ? 'कार्यक्रम का स्थान दर्ज करें' : 'Enter event location'}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'मुख्य छवि URL' : 'Featured Image URL'}
                </label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={language === 'hi' ? 'छवि का URL दर्ज करें' : 'Enter image URL'}
                />
              </div>
            </div>

            {/* Content in Hindi */}
            {currentTab === 'hi' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  हिंदी में सामग्री
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      शीर्षक (हिंदी)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_hi}
                      onChange={(e) => handleInputChange('title_hi', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="कार्यक्रम का शीर्षक दर्ज करें"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      विवरण (हिंदी)
                    </label>
                    <RichTextEditor
                      content={formData.description_hi}
                      onChange={(content) => handleInputChange('description_hi', content)}
                      placeholder="कार्यक्रम का विस्तृत विवरण लिखें..."
                    />
                  </div>

                  {/* SEO Fields for Hindi */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                      SEO सेटिंग्स (हिंदी)
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          मेटा शीर्षक (हिंदी)
                        </label>
                        <input
                          type="text"
                          value={formData.meta_title_hi}
                          onChange={(e) => handleInputChange('meta_title_hi', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="SEO के लिए मेटा शीर्षक (वैकल्पिक)"
                          maxLength={60}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.meta_title_hi.length}/60 characters (खाली छोड़ने पर शीर्षक का उपयोग होगा)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          मेटा विवरण (हिंदी)
                        </label>
                        <textarea
                          value={formData.meta_description_hi}
                          onChange={(e) => handleInputChange('meta_description_hi', e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="खोज परिणामों में दिखने वाला संक्षिप्त विवरण"
                          maxLength={160}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.meta_description_hi.length}/160 characters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content in English */}
            {currentTab === 'en' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Content in English
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English)
                    </label>
                    <RichTextEditor
                      content={formData.description_en}
                      onChange={(content) => handleInputChange('description_en', content)}
                      placeholder="Write detailed event description..."
                    />
                  </div>

                  {/* SEO Fields for English */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                      SEO Settings (English)
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Meta Title (English)
                        </label>
                        <input
                          type="text"
                          value={formData.meta_title_en}
                          onChange={(e) => handleInputChange('meta_title_en', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="SEO meta title (optional)"
                          maxLength={60}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.meta_title_en.length}/60 characters (will use title if empty)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Meta Description (English)
                        </label>
                        <textarea
                          value={formData.meta_description_en}
                          onChange={(e) => handleInputChange('meta_description_en', e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="Brief description that appears in search results"
                          maxLength={160}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.meta_description_en.length}/160 characters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tags and Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {language === 'hi' ? 'टैग और सेटिंग्स' : 'Tags and Settings'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'टैग' : 'Tags'}
                  </label>
                  <div className="mt-1 flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder={language === 'hi' ? 'टैग दर्ज करें' : 'Enter tag'}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                    >
                      {language === 'hi' ? 'जोड़ें' : 'Add'}
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-orange-600 hover:text-orange-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                    {language === 'hi' ? 'तुरंत प्रकाशित करें' : 'Publish immediately'}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {saving 
                  ? (language === 'hi' ? 'सहेज रहे हैं...' : 'Saving...') 
                  : (language === 'hi' ? 'कार्यक्रम सहेजें' : 'Save Event')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
