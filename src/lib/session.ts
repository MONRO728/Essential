import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Returns the signed-in session, or null. Safe to call from server components and route handlers. */
export async function getCurrentSession() {
  return getServerSession(authOptions);
}

/** Server-component guard: redirects to /login if no one is signed in. */
export async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user) redirect('/login');
  return session.user;
}

/** Server-component guard: redirects non-admins away from /admin/*. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/dashboard');
  return user;
}
