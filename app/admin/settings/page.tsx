'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const settingsSchema = z.object({
  siteName_hi: z.string().min(1, 'Site name in Hindi is required'),
  siteName_en: z.string().min(1, 'Site name in English is required'),
  siteDescription_hi: z.string().min(1, 'Site description in Hindi is required'),
  siteDescription_en: z.string().min(1, 'Site description in English is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address_hi: z.string().min(1, 'Address in Hindi is required'),
  address_en: z.string().min(1, 'Address in English is required'),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const settings = await response.json();
        
        // Set form values
        Object.keys(settings).forEach((key) => {
          setValue(key as keyof SettingsFormData, settings[key]);
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(language === 'hi' ? 'सेटिंग्स सफलतापूर्वक सहेजी गईं' : 'Settings saved successfully');
      } else {
        alert(language === 'hi' ? 'सेटिंग्स सहेजने में त्रुटि' : 'Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(language === 'hi' ? 'सेटिंग्स सहेजने में त्रुटि' : 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-semibold text-gray-900">
            {language === 'hi' ? 'साइट सेटिंग्स' : 'Site Settings'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
            {/* Site Information */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {language === 'hi' ? 'साइट जानकारी' : 'Site Information'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {language === 'hi' 
                      ? 'मुख्य साइट की जानकारी और विवरण।' 
                      : 'Basic site information and description.'
                    }
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'साइट नाम (हिंदी)' : 'Site Name (Hindi)'}
                      </label>
                      <input
                        type="text"
                        {...register('siteName_hi')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.siteName_hi && (
                        <p className="mt-2 text-sm text-red-600">{errors.siteName_hi.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'साइट नाम (अंग्रेजी)' : 'Site Name (English)'}
                      </label>
                      <input
                        type="text"
                        {...register('siteName_en')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.siteName_en && (
                        <p className="mt-2 text-sm text-red-600">{errors.siteName_en.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'साइट विवरण (हिंदी)' : 'Site Description (Hindi)'}
                      </label>
                      <textarea
                        rows={3}
                        {...register('siteDescription_hi')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.siteDescription_hi && (
                        <p className="mt-2 text-sm text-red-600">{errors.siteDescription_hi.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'साइट विवरण (अंग्रेजी)' : 'Site Description (English)'}
                      </label>
                      <textarea
                        rows={3}
                        {...register('siteDescription_en')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.siteDescription_en && (
                        <p className="mt-2 text-sm text-red-600">{errors.siteDescription_en.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {language === 'hi' 
                      ? 'संपर्क विवरण और पता।' 
                      : 'Contact details and address.'
                    }
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        {...register('contactEmail')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.contactEmail && (
                        <p className="mt-2 text-sm text-red-600">{errors.contactEmail.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                      </label>
                      <input
                        type="text"
                        {...register('contactPhone')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.contactPhone && (
                        <p className="mt-2 text-sm text-red-600">{errors.contactPhone.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'पता (हिंदी)' : 'Address (Hindi)'}
                      </label>
                      <textarea
                        rows={3}
                        {...register('address_hi')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.address_hi && (
                        <p className="mt-2 text-sm text-red-600">{errors.address_hi.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'पता (अंग्रेजी)' : 'Address (English)'}
                      </label>
                      <textarea
                        rows={3}
                        {...register('address_en')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.address_en && (
                        <p className="mt-2 text-sm text-red-600">{errors.address_en.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {language === 'hi' ? 'सोशल मीडिया' : 'Social Media'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {language === 'hi' 
                      ? 'सोशल मीडिया प्रोफाइल लिंक।' 
                      : 'Social media profile links.'
                    }
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Facebook</label>
                      <input
                        type="url"
                        {...register('socialMedia.facebook')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Twitter</label>
                      <input
                        type="url"
                        {...register('socialMedia.twitter')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Instagram</label>
                      <input
                        type="url"
                        {...register('socialMedia.instagram')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">YouTube</label>
                      <input
                        type="url"
                        {...register('socialMedia.youtube')}
                        className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {saving 
                  ? (language === 'hi' ? 'सहेज रहे हैं...' : 'Saving...')
                  : (language === 'hi' ? 'सेटिंग्स सहेजें' : 'Save Settings')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
