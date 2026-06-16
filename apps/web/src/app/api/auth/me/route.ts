import { NextRequest, NextResponse } from 'next/server';
import { handleGetMe, getTokenFromRequest, verifyToken } from '@/lib/auth-handlers';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req) || req.cookies.get('clientoq_jwt')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    const user = await handleGetMe(decoded.sub);
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
