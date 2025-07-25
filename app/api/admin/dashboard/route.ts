import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-config';
import { pool } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get dashboard statistics
    const [
      eventsResult,
      publishedEventsResult,
      draftEventsResult,
      mediaResult,
      contactResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM events'),
      pool.query('SELECT COUNT(*) as count FROM events WHERE published = true'),
      pool.query('SELECT COUNT(*) as count FROM events WHERE published = false'),
      pool.query('SELECT COUNT(*) as count FROM media_files'),
      pool.query('SELECT COUNT(*) as count FROM contact_submissions')
    ]);

    const stats = {
      totalEvents: parseInt(eventsResult.rows[0]?.count || '0'),
      publishedEvents: parseInt(publishedEventsResult.rows[0]?.count || '0'),
      draftEvents: parseInt(draftEventsResult.rows[0]?.count || '0'),
      totalMedia: parseInt(mediaResult.rows[0]?.count || '0'),
      contactSubmissions: parseInt(contactResult.rows[0]?.count || '0'),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
