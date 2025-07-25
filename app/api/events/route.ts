import { NextRequest, NextResponse } from 'next/server';

// Mock events data - in production this would come from database
const mockEvents = [
  {
    id: 1,
    title: "स्वतंत्रता दिवस समारोह",
    titleEn: "Independence Day Celebration",
    slug: "independence-day-celebration",
    date: "2025-08-15",
    time: "09:00",
    location: "नई दिल्ली",
    description: "राष्ट्रीय पर्व के अवसर पर विशेष कार्यक्रम का आयोजन। इस अवसर पर हम देशभक्ति गीत, सांस्कृतिक कार्यक्रम और सामुदायिक गतिविधियों का आयोजन करेंगे।",
    isPublished: true,
    coverImage: "/api/placeholder/600/400",
    createdAt: "2025-07-01T00:00:00Z"
  },
  {
    id: 2,
    title: "वृक्षारोपण अभियान",
    titleEn: "Tree Plantation Drive",
    slug: "tree-plantation-drive",
    date: "2025-08-01",
    time: "07:00",
    location: "गुड़गांव",
    description: "पर्यावरण संरक्षण के लिए वृक्षारोपण कार्यक्रम। हमारा लक्ष्य इस कार्यक्रम में 500 पेड़ लगाना है।",
    isPublished: true,
    coverImage: "/api/placeholder/600/400",
    createdAt: "2025-07-01T00:00:00Z"
  },
  {
    id: 3,
    title: "शिक्षा सहायता कार्यक्रम",
    titleEn: "Education Support Program",
    slug: "education-support-program",
    date: "2025-07-20",
    time: "10:00",
    location: "नोएडा",
    description: "गरीब बच्चों के लिए शैक्षणिक सामग्री वितरण कार्यक्रम। इसमें किताबें, कॉपी, पेन और अन्य स्कूल सामग्री शामिल है।",
    isPublished: true,
    coverImage: "/api/placeholder/600/400",
    createdAt: "2025-07-01T00:00:00Z"
  },
  {
    id: 4,
    title: "स्वास्थ्य जांच शिविर",
    titleEn: "Health Check-up Camp",
    slug: "health-checkup-camp",
    date: "2025-07-10",
    time: "08:00",
    location: "फरीदाबाद",
    description: "निःशुल्क स्वास्थ्य जांच और परामर्श सेवा। योग्य डॉक्टरों द्वारा जांच और मुफ्त दवाएं।",
    isPublished: true,
    coverImage: "/api/placeholder/600/400",
    createdAt: "2025-07-01T00:00:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'upcoming' or 'past'
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const currentDate = new Date();
    let filteredEvents = mockEvents.filter(event => event.isPublished);

    if (type === 'upcoming') {
      filteredEvents = filteredEvents.filter(event => new Date(event.date) >= currentDate);
    } else if (type === 'past') {
      filteredEvents = filteredEvents.filter(event => new Date(event.date) < currentDate);
    }

    // Sort by date (upcoming: ascending, past: descending)
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return type === 'past' ? dateB - dateA : dateA - dateB;
    });

    // Apply pagination
    const paginatedEvents = filteredEvents.slice(offset, offset + limit);

    return NextResponse.json({
      events: paginatedEvents,
      total: filteredEvents.length,
      hasMore: offset + limit < filteredEvents.length
    });

  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'कार्यक्रम लोड करने में समस्या हुई' },
      { status: 500 }
    );
  }
}
