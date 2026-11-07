import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '../../_lib/backend';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    // Enhanced Validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ message: 'Full name is too short' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Call backend registration API
    const backendUrl = getBackendUrl();
    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        return NextResponse.json(
          { message: data.message || 'Registration failed' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json({ success: true, user: data.user });
    } catch (error) {
      console.error('Registration backend error:', error);
      return NextResponse.json({ message: 'Backend connection issue' }, { status: 503 });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
