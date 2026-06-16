import { NextRequest, NextResponse } from 'next/server';
import { handleGoogleLogin } from '@/lib/auth-handlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await handleGoogleLogin(body.credential);
    const res = NextResponse.json(result);
    res.cookies.set('clientoq_jwt', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Google login failed' }, { status: 401 });
  }
}
