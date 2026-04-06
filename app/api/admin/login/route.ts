export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, getAdminSessionCookieValue, isValidAdminLogin } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || '');
    const password = String(body.password || '');

    if (!isValidAdminLogin(username, password)) {
      return NextResponse.json({ error: 'Invalid login.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_COOKIE,
      value: getAdminSessionCookieValue(),
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
