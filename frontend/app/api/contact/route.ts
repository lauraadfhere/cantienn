import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '../_lib/backend';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  privacy_agreement: boolean;
  captcha_answer?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate privacy agreement
    if (!body.privacy_agreement) {
      return NextResponse.json(
        { message: 'Privacy agreement must be accepted' },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.length > 2000) {
      return NextResponse.json(
        { message: 'Message exceeds maximum length of 2000 characters' },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (body.phone && body.phone.length > 0) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(body.phone)) {
        return NextResponse.json(
          { message: 'Invalid phone number format' },
          { status: 400 }
        );
      }
    }

    // Prepare data for Parse Server
    const contactData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      subject: body.subject.trim(),
      message: body.message.trim(),
      privacy_agreement: body.privacy_agreement,
      status: 'new',
      created_at: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    };

    // Send to backend/Parse Server
    const backendUrl = getBackendUrl();
    
    try {
      const backendResponse = await fetch(`${backendUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': process.env.PARSE_APP_ID || '',
          'X-Parse-REST-API-Key': process.env.PARSE_REST_API_KEY || '',
        },
        body: JSON.stringify(contactData),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        console.error('Backend error:', backendData);
        return NextResponse.json(
          { message: 'Failed to submit contact form. Please try again later.' },
          { status: backendResponse.status }
        );
      }

      // Send confirmation email (optional)
      try {
        await fetch(`${backendUrl}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': process.env.PARSE_APP_ID || '',
            'X-Parse-REST-API-Key': process.env.PARSE_REST_API_KEY || '',
          },
          body: JSON.stringify({
            to: body.email,
            subject: 'We received your message',
            template: 'contact_confirmation',
            data: {
              name: body.name,
              subject: body.subject,
            },
          }),
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json(
        { 
          message: 'Contact form submitted successfully',
          id: backendData.objectId || backendData.id,
        },
        { status: 200 }
      );
    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      const errorMsg = backendError instanceof Error ? backendError.message : 'Connection failed';
      
      if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('Failed to fetch')) {
        return NextResponse.json(
          { message: 'Backend server is not available. Please try again later.' },
          { status: 503 }
        );
      }
      
      throw backendError;
    }
  } catch (error) {
    console.error('Contact form error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { message: `Error processing contact form: ${errorMsg}` },
      { status: 500 }
    );
  }
}
