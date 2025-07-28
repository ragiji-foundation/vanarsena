import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-config';
import { seedDatabase } from '../../../../lib/seedData';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the seed function
    const result = await seedDatabase();

    if (result.success) {
      return NextResponse.json({ 
        message: result.message,
        success: true 
      });
    } else {
      return NextResponse.json({ 
        error: result.message,
        success: false 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
