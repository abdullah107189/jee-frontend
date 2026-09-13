import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'techstore_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET || 'development-only-techstore-session-secret';

export type AuthRole = 'admin' | 'seller' | 'customer';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

function encode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function sign(payload: string) {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

function serialize(user: CurrentUser) {
  const payload = encode(JSON.stringify(user));
  return `${payload}.${sign(payload)}`;
}

function deserialize(value: string): CurrentUser | null {
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  try {
    const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as CurrentUser;
    if (!user.id || !user.name || !user.email || !['admin', 'seller', 'customer'].includes(user.role)) return null;
    return user;
  } catch {
    return null;
  }
}

export async function authenticate(credentials: { email?: string; password?: string; role?: string }): Promise<CurrentUser> {
  const email = credentials.email?.trim();
  const password = credentials.password;
  const role = credentials.role;
  if (!email || !password || !role || !['admin', 'seller', 'customer'].includes(role)) throw new Error('Invalid credentials');

  return { id: '1', name: 'Md. Rahman', email, role: role as AuthRole };
}

export async function createSession(user: CurrentUser) {
  (await cookies()).set(SESSION_COOKIE_NAME, serialize(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const value = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return value ? deserialize(value) : null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');
  return user;
}

export async function requireRole(role: AuthRole) {
  const user = await requireAuth();
  if (user.role !== role) throw new Error(`${role} access required`);
  return user;
}