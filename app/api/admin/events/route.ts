import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-config';
import { getAllEventsAdmin, createEvent } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    const events = await getAllEventsAdmin(filter as 'all' | 'published' | 'draft');
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Prepare event data
    const eventData = {
      slug: data.slug,
      event_date: data.event_date,
      event_time: data.event_time || null,
      location: data.location,
      tags: data.tags || [],
      media_urls: [],
      video_urls: [],
      document_urls: [],
      visibility: data.published ? 'published' : 'draft',
      featured_image: data.featured_image || null,
      title_hi: data.title_hi,
      title_en: data.title_en,
      description_hi: data.description_hi,
      description_en: data.description_en,
      meta_title_hi: data.meta_title_hi || data.title_hi,
      meta_title_en: data.meta_title_en || data.title_en,
      meta_description_hi: data.meta_description_hi || data.title_hi,
      meta_description_en: data.meta_description_en || data.title_en,
    };
    
    const eventId = await createEvent(eventData);
    
    return NextResponse.json({ 
      id: eventId, 
      message: 'Event created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
