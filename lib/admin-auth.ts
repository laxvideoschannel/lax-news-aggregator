import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'laxhub_admin';

function getAdminUser() {
  return process.env.ADMIN_USERNAME || 'admin';
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function getAdminSessionValue() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_VIDEO_API_KEY || 'laxhub-admin-session';
}

export function isValidAdminLogin(username: string, password: string) {
  return username === getAdminUser() && password === getAdminPassword() && Boolean(getAdminPassword());
}

export function getAdminSessionCookieValue() {
  return getAdminSessionValue();
}

export function isAuthorizedAdminRequest(request: Request) {
  const adminSecret = process.env.ADMIN_VIDEO_API_KEY;
  const incomingSecret = request.headers.get('x-admin-key');

  if (adminSecret && incomingSecret === adminSecret) {
    return true;
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const expected = `${ADMIN_COOKIE}=${getAdminSessionValue()}`;
  return cookieHeader.split(';').some((part) => part.trim() === expected);
}

export function getAdminSessionFromCookies() {
  return cookies().get(ADMIN_COOKIE)?.value === getAdminSessionValue();
}
