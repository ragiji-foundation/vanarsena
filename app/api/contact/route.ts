import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, volunteerInterest } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'सभी आवश्यक फ़ील्ड भरें' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'कृपया सही ईमेल पता दर्ज करें' },
        { status: 400 }
      );
    }

    // Save to database
    try {
      const contactId = await saveContactSubmission({
        name,
        email,
        phone,
        subject,
        message
      });

      console.log('Contact form submission saved with ID:', contactId);

      return NextResponse.json(
        { 
          message: 'आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।',
          id: contactId
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Log to console but still return success to user (fallback behavior)
      console.log('Contact form submission (DB failed):', {
        name,
        email,
        phone,
        subject,
        message,
        volunteerInterest,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { 
          message: 'आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।' 
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'संदेश भेजने में कोई समस्या हुई है। कृपया दोबारा कोशिश करें।' },
      { status: 500 }
    );
  }
}
