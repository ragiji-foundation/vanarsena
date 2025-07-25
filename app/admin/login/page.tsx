'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const { data: session, status } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'loading') return;
    
    if (session && session.user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [session, status, router]);

  // Also check for session updates after login
  useEffect(() => {
    const checkSession = async () => {
      if (!isLoading && status === 'authenticated' && session?.user?.role === 'admin') {
        router.replace('/admin/dashboard');
      }
    };
    
    checkSession();
  }, [session, status, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        callbackUrl: '/admin/dashboard',
        redirect: true,
      });

      if (result?.error) {
        setError(language === 'hi' ? 'गलत उपयोगकर्ता नाम या पासवर्ड' : 'Invalid username or password');
        setIsLoading(false);
      }
      // If successful, NextAuth will handle the redirect
    } catch (error) {
      console.error('Login error:', error);
      setError(language === 'hi' ? 'लॉगिन में त्रुटि हुई' : 'Login error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">वानरसेना</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {language === 'hi' 
              ? 'अपने एडमिन खाते में साइन इन करें'
              : 'Sign in to your admin account'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'उपयोगकर्ता नाम' : 'Username'}
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={language === 'hi' ? 'अपना उपयोगकर्ता नाम दर्ज करें' : 'Enter your username'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder={language === 'hi' ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? (language === 'hi' ? 'लॉगिन हो रहा है...' : 'Signing in...')
                  : (language === 'hi' ? 'लॉगिन करें' : 'Sign in')
                }
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {language === 'hi' ? 'या' : 'or'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-orange-600 hover:text-orange-500 text-sm font-medium"
              >
                {language === 'hi' ? 'मुख्य साइट पर वापस जाएं' : 'Back to main site'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
