
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // In a real application, you would validate against a database.
    // For this example, we'll use hardcoded credentials.
    if (username === 'Admin' && password === 'password') {
      // In a real app, you would generate and return a JWT or session token here.
      return NextResponse.json({
        success: true,
        message: 'Login successful.',
        token: 'authenticated', // Example token
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
