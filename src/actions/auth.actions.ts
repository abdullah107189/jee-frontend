'use server';

import { authenticate, createSession, destroySession } from '@/services/auth.service';

export async function loginAction(credentials: { email?: string; password?: string; role?: string }) {
  const user = await authenticate(credentials);
  await createSession(user);
  return { success: true, user };
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}