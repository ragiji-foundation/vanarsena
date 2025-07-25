import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth-config';
import { pool } from '../../../../../lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const eventQuery = `
      SELECT 
        e.*,
        et_hi.title as title_hi,
        et_hi.description as description_hi,
        et_hi.meta_title as meta_title_hi,
        et_hi.meta_description as meta_description_hi,
        et_en.title as title_en,
        et_en.description as description_en,
        et_en.meta_title as meta_title_en,
        et_en.meta_description as meta_description_en
      FROM events e
      LEFT JOIN event_translations et_hi ON e.id = et_hi.event_id AND et_hi.locale = 'hi'
      LEFT JOIN event_translations et_en ON e.id = et_en.event_id AND et_en.locale = 'en'
      WHERE e.id = $1
    `;
    
    const result = await pool.query(eventQuery, [eventId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = result.rows[0];
    const formattedEvent = {
      ...event,
      published: event.visibility === 'published',
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const data = await request.json();
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Update event
      await client.query(`
        UPDATE events 
        SET event_date = $1, event_time = $2, location = $3, tags = $4, 
            visibility = $5, featured_image = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
      `, [
        data.event_date,
        data.event_time,
        data.location,
        JSON.stringify(data.tags || []),
        data.published ? 'published' : 'draft',
        data.featured_image,
        eventId
      ]);
      
      // Update Hindi translation
      if (data.title_hi || data.description_hi) {
        await client.query(`
          INSERT INTO event_translations (event_id, locale, title, description, meta_title, meta_description)
          VALUES ($1, 'hi', $2, $3, $4, $5)
          ON CONFLICT (event_id, locale) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            meta_title = EXCLUDED.meta_title,
            meta_description = EXCLUDED.meta_description,
            updated_at = CURRENT_TIMESTAMP
        `, [eventId, data.title_hi, data.description_hi, data.meta_title_hi || data.title_hi, data.meta_description_hi || data.title_hi]);
      }
      
      // Update English translation
      if (data.title_en || data.description_en) {
        await client.query(`
          INSERT INTO event_translations (event_id, locale, title, description, meta_title, meta_description)
          VALUES ($1, 'en', $2, $3, $4, $5)
          ON CONFLICT (event_id, locale) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            meta_title = EXCLUDED.meta_title,
            meta_description = EXCLUDED.meta_description,
            updated_at = CURRENT_TIMESTAMP
        `, [eventId, data.title_en, data.description_en, data.meta_title_en || data.title_en, data.meta_description_en || data.title_en]);
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json({ message: 'Event updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Event update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const eventId = parseInt(params.id);
    
    // Delete event translations first
    await pool.query('DELETE FROM event_translations WHERE event_id = $1', [eventId]);
    
    // Delete the event
    const result = await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
