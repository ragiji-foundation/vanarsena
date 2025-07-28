import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'hi';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const published = searchParams.get('published') !== 'false'; // Default to true

    // Get events from database
    const events = await getEvents(locale as 'hi' | 'en', limit);

    // Filter published events if needed
    const filteredEvents = published ? events.filter(event => event.visibility === 'published') : events;

    return NextResponse.json(filteredEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Fallback to mock data if database fails
    const mockEvents = [
      {
        id: 1,
        title: "स्वतंत्रता दिवस समारोह",
        slug: "independence-day-celebration",
        event_date: "2025-08-15",
        event_time: "09:00",
        location: "नई दिल्ली",
        description: "राष्ट्रीय पर्व के अवसर पर विशेष कार्यक्रम का आयोजन। इस अवसर पर हम देशभक्ति गीत, सांस्कृतिक कार्यक्रम और सामुदायिक गतिविधियों का आयोजन करेंगे।",
        visibility: "published",
        featured_image: "https://images.unsplash.com/photo-1628624747186-a88c0f48a658?w=800&h=400&fit=crop",
        created_at: "2025-07-01T00:00:00Z"
      },
      {
        id: 2,
        title: "वृक्षारोपण अभियान",
        slug: "tree-plantation-drive",
        event_date: "2025-08-01",
        event_time: "07:00",
        location: "गुड़गांव",
        description: "पर्यावरण संरक्षण के लिए वृक्षारोपण कार्यक्रम। हमारा लक्ष्य इस कार्यक्रम में 500 पेड़ लगाना है।",
        visibility: "published",
        featured_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
        created_at: "2025-07-01T00:00:00Z"
      },
      {
        id: 3,
        title: "शिक्षा सहायता कार्यक्रम",
        slug: "education-support-program",
        event_date: "2025-07-20",
        event_time: "10:00",
        location: "नोएडा",
        description: "गरीब बच्चों के लिए शैक्षणिक सामग्री वितरण कार्यक्रम। इसमें किताबें, कॉपी, पेन और अन्य स्कूल सामग्री शामिल है।",
        visibility: "published",
        featured_image: "https://images.unsplash.com/photo-1427751840561-9852520f8ce8?w=800&h=400&fit=crop",
        created_at: "2025-07-01T00:00:00Z"
      }
    ];
    
    return NextResponse.json(mockEvents);
  }
}
