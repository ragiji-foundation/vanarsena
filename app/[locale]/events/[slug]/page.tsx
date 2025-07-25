import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getEventBySlug } from '../../../../lib/db';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  try {
    const event = await getEventBySlug(slug, locale as 'hi' | 'en');
    
    if (!event) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      };
    }

    const title = event.meta_title || event.title;
    const description = event.meta_description || (event.description ? 
      event.description.replace(/<[^>]*>/g, '').substring(0, 160) : 
      `Join us for ${event.title} on ${new Date(event.event_date).toLocaleDateString()}`
    );

    const eventUrl = `${process.env.NEXTAUTH_URL}/${locale}/events/${slug}`;
    const eventDate = new Date(event.event_date);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: eventUrl,
        siteName: 'VanarSena - Social Service Organization',
        type: 'article',
        publishedTime: event.created_at,
        modifiedTime: event.updated_at || event.created_at,
        locale: locale,
        images: event.featured_image ? [
          {
            url: event.featured_image,
            width: 1200,
            height: 630,
            alt: event.title,
          }
        ] : [],
        tags: event.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: event.featured_image ? [event.featured_image] : [],
      },
      robots: {
        index: event.visibility === 'published',
        follow: event.visibility === 'published',
      },
      alternates: {
        canonical: eventUrl,
        languages: {
          'hi': `${process.env.NEXTAUTH_URL}/hi/events/${slug}`,
          'en': `${process.env.NEXTAUTH_URL}/en/events/${slug}`,
        },
      },
      other: {
        'article:author': 'VanarSena',
        'article:published_time': event.created_at,
        'article:modified_time': event.updated_at || event.created_at,
        'event:start_time': event.event_date + (event.event_time ? `T${event.event_time}:00` : ''),
        'event:location': event.location,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
    };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  
  try {
    const event = await getEventBySlug(slug, locale as 'hi' | 'en');

    if (!event || event.visibility !== 'published') {
      notFound();
    }

    const eventDate = new Date(event.event_date);
    const isUpcoming = eventDate >= new Date();
    const formattedDate = eventDate.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = event.event_time ? 
      new Date(`2000-01-01T${event.event_time}`).toLocaleTimeString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }) : null;

    // Structured data for search engines
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description?.replace(/<[^>]*>/g, '').substring(0, 200),
      "startDate": event.event_date + (event.event_time ? `T${event.event_time}:00` : ''),
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": event.location
      },
      "organizer": {
        "@type": "Organization",
        "name": "VanarSena",
        "url": process.env.NEXTAUTH_URL
      },
      "image": event.featured_image || `${process.env.NEXTAUTH_URL}/api/placeholder/800/400`,
      "url": `${process.env.NEXTAUTH_URL}/${locale}/events/${slug}`,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    };

    return (
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gray-50">
          {/* Breadcrumb Navigation */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-2 py-4 text-sm">
                <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-700">
                  {locale === 'hi' ? 'होम' : 'Home'}
                </Link>
                <span className="text-gray-400">/</span>
                <Link href={`/${locale}/events`} className="text-gray-500 hover:text-gray-700">
                  {locale === 'hi' ? 'कार्यक्रम' : 'Events'}
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">{event.title}</span>
              </div>
            </div>
          </nav>

          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Event Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isUpcoming
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isUpcoming 
                  ? (locale === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Event')
                  : (locale === 'hi' ? 'पूर्ण कार्यक्रम' : 'Past Event')
                }
              </span>
            </div>

            {/* Event Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            {/* Event Meta Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      {locale === 'hi' ? 'तारीख' : 'Date'}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{formattedDate}</p>
                  </div>
                </div>

                {formattedTime && (
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        {locale === 'hi' ? 'समय' : 'Time'}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">{formattedTime}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      {locale === 'hi' ? 'स्थान' : 'Location'}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {event.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={event.featured_image}
                  alt={event.title}
                  className="w-full h-64 sm:h-96 object-cover"
                />
              </div>
            )}

            {/* Event Description */}
            {event.description && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'hi' ? 'कार्यक्रम विवरण' : 'Event Details'}
                </h2>
                <div 
                  className="prose prose-lg max-w-none prose-orange"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {locale === 'hi' ? 'श्रेणियां' : 'Categories'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Events */}
            <div className="text-center">
              <Link
                href={`/${locale}/events`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {locale === 'hi' ? 'सभी कार्यक्रम देखें' : 'View All Events'}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}
