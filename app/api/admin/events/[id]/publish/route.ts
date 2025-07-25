import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../lib/auth-config';
import { pool } from '../../../../../../lib/db';

export async function PATCH(
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
    const { published } = await request.json();
    
    const result = await pool.query(
      'UPDATE events SET published = $1 WHERE id = $2 RETURNING *',
      [published, eventId]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Event status updated successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Event publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
