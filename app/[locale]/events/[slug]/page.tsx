import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getEventBySlug } from '../../../../lib/db';
import ShareButton from '../../../../components/ShareButton';

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
          {/* Article Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb Navigation */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
                      {locale === 'hi' ? 'होम' : 'Home'}
                    </Link>
                  </li>
                  <li>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <Link href={`/${locale}/events`} className="hover:text-gray-700 transition-colors">
                      {locale === 'hi' ? 'कार्यक्रम' : 'Events'}
                    </Link>
                  </li>
                  <li>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="text-gray-900 font-medium">{event.title}</li>
                </ol>
              </nav>

              {/* Event Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isUpcoming
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isUpcoming 
                    ? (locale === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Event')
                    : (locale === 'hi' ? 'पूर्ण कार्यक्रम' : 'Past Event')
                  }
                </span>
              </div>

              {/* Event Title */}
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Event Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formattedDate}</span>
                </div>

                {formattedTime && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{formattedTime}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              {event.featured_image && (
                <div className="aspect-video">
                  <img
                    src={event.featured_image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 lg:p-12">
                {/* Event Description */}
                {event.description && (
                  <div className="prose prose-lg prose-orange max-w-none mb-8">
                    <div 
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {locale === 'hi' ? 'श्रेणियां' : 'Categories'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {event.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {locale === 'hi' ? 'इस कार्यक्रम को साझा करें' : 'Share this event'}
                    </h3>
                    <div className="flex space-x-4">
                      <ShareButton 
                        title={event.title}
                        description={event.description}
                        locale={locale}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Back to Events */}
            <div className="text-center mt-12">
              <Link
                href={`/${locale}/events`}
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-lg"
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
