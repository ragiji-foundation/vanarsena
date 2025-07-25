import Link from 'next/link';
import { Metadata } from 'next';
import { getEvents } from '../../../lib/db';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'hi' 
    ? 'कार्यक्रम - वानरसेना | सामाजिक सेवा संगठन'
    : 'Events - VanarSena | Social Service Organization';
    
  const description = locale === 'hi'
    ? 'वानरसेना के आगामी और पिछले कार्यक्रमों की सूची। स्वतंत्रता दिवस समारोह, वृक्षारोपण अभियान, शिक्षा सहायता और अन्य सामुदायिक कार्यक्रमों में भाग लें।'
    : 'List of upcoming and past events by VanarSena. Join Independence Day celebrations, tree plantation drives, education support programs, and other community events.';

  const eventsUrl = `${process.env.NEXTAUTH_URL}/${locale}/events`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: eventsUrl,
      siteName: 'VanarSena - Social Service Organization',
      type: 'website',
      locale: locale,
      images: [
        {
          url: `${process.env.NEXTAUTH_URL}/api/placeholder/1200/630`,
          width: 1200,
          height: 630,
          alt: locale === 'hi' ? 'वानरसेना कार्यक्रम' : 'VanarSena Events',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${process.env.NEXTAUTH_URL}/api/placeholder/1200/630`],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: eventsUrl,
      languages: {
        'hi': `${process.env.NEXTAUTH_URL}/hi/events`,
        'en': `${process.env.NEXTAUTH_URL}/en/events`,
      },
    },
  };
}

export default async function EventsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  
  try {
    // Fetch events from database
    const events = await getEvents(locale as 'hi' | 'en');
    
    // Filter events by category if specified
    const filteredEvents = category && category !== 'all' 
      ? events.filter(event => event.tags?.includes(category))
      : events;

    // Separate upcoming and past events
    const now = new Date();
    const upcomingEvents = filteredEvents.filter(event => new Date(event.event_date) >= now);
    const pastEvents = filteredEvents.filter(event => new Date(event.event_date) < now);

    // Categories for filtering
    const categories = [
      { id: 'all', name: locale === 'hi' ? 'सभी' : 'All' },
      { id: 'देशभक्ति', name: locale === 'hi' ? 'देशभक्ति' : 'Patriotic' },
      { id: 'पर्यावरण', name: locale === 'hi' ? 'पर्यावरण' : 'Environment' },
      { id: 'शिक्षा', name: locale === 'hi' ? 'शिक्षा' : 'Education' },
      { id: 'स्वास्थ्य', name: locale === 'hi' ? 'स्वास्थ्य' : 'Health' },
    ];

    // Structured data for search engines
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": locale === 'hi' ? 'वानरसेना कार्यक्रम' : 'VanarSena Events',
      "description": locale === 'hi' 
        ? 'वानरसेना द्वारा आयोजित सामुदायिक कार्यक्रमों की सूची'
        : 'List of community events organized by VanarSena',
      "url": `${process.env.NEXTAUTH_URL}/${locale}/events`,
      "numberOfItems": filteredEvents.length,
      "itemListElement": filteredEvents.slice(0, 10).map((event, index) => ({
        "@type": "Event",
        "position": index + 1,
        "name": event.title,
        "startDate": event.event_date + (event.event_time ? `T${event.event_time}:00` : ''),
        "location": {
          "@type": "Place",
          "name": event.location
        },
        "url": `${process.env.NEXTAUTH_URL}/${locale}/events/${event.slug}`,
        "image": event.featured_image || `${process.env.NEXTAUTH_URL}/api/placeholder/600/400`,
        "organizer": {
          "@type": "Organization",
          "name": "VanarSena"
        }
      }))
    };

    return (
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gray-50">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {locale === 'hi' ? 'हमारे कार्यक्रम' : 'Our Events'}
                </h1>
                <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
                  {locale === 'hi' 
                    ? 'समुदाय के साथ जुड़ें और सामाजिक बदलाव में भागीदार बनें'
                    : 'Connect with the community and be part of social change'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/events${cat.id !== 'all' ? `?category=${cat.id}` : ''}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      (category || 'all') === cat.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {locale === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Events'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} locale={locale} isUpcoming={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {locale === 'hi' ? 'पूर्व कार्यक्रम' : 'Past Events'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} locale={locale} isUpcoming={false} />
                  ))}
                </div>
              </section>
            )}

            {/* No Events Message */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm border p-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {locale === 'hi' ? 'कोई कार्यक्रम नहीं मिला' : 'No events found'}
                  </h3>
                  <p className="text-gray-500">
                    {locale === 'hi' 
                      ? 'इस श्रेणी में कोई कार्यक्रम उपलब्ध नहीं है।'
                      : 'No events are available in this category.'
                    }
                  </p>
                  <Link
                    href={`/${locale}/events`}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-100 hover:bg-orange-200"
                  >
                    {locale === 'hi' ? 'सभी कार्यक्रम देखें' : 'View All Events'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading events:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'hi' ? 'कार्यक्रम लोड करने में त्रुटि' : 'Error Loading Events'}
          </h1>
          <p className="text-gray-600 mb-4">
            {locale === 'hi' 
              ? 'कार्यक्रम लोड करने में समस्या हुई है। कृपया बाद में पुनः प्रयास करें।'
              : 'There was a problem loading events. Please try again later.'
            }
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            {locale === 'hi' ? 'होम पेज पर वापस जाएं' : 'Go Back to Home'}
          </Link>
        </div>
      </div>
    );
  }
}

// Event Card Component
function EventCard({ event, locale, isUpcoming }: { 
  event: any; 
  locale: string; 
  isUpcoming: boolean; 
}) {
  const eventDate = new Date(event.event_date);
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

  return (
    <article className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Status Badge */}
      <div className="relative">
        {event.featured_image && (
          <img
            src={event.featured_image}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isUpcoming
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isUpcoming 
              ? (locale === 'hi' ? 'आगामी' : 'Upcoming')
              : (locale === 'hi' ? 'संपन्न' : 'Past')
            }
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Event Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link 
            href={`/${locale}/events/${event.slug}`}
            className="hover:text-orange-600 transition-colors"
          >
            {event.title}
          </Link>
        </h3>

        {/* Event Meta */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          
          {formattedTime && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formattedTime}
            </div>
          )}

          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 2).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{event.tags.length - 2} {locale === 'hi' ? 'और' : 'more'}
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <Link
          href={`/${locale}/events/${event.slug}`}
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm"
        >
          {locale === 'hi' ? 'विस्तार से पढ़ें' : 'Read More'}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
