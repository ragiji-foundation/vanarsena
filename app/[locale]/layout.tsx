import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { LanguageProvider } from "../../contexts/LanguageContext";
import AuthProvider from "../../components/providers/AuthProvider";
import { i18n, type Locale } from "../../lib/i18n-config";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  
  if (locale === 'hi') {
    return {
      title: "VanarSena - वानरसेना",
      description: "VanarSena NGO - समाज सेवा के लिए प्रतिबद्ध",
    };
  }
  
  return {
    title: "VanarSena - Social Service NGO",
    description: "VanarSena NGO - Committed to Social Service",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!i18n.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <Header />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
