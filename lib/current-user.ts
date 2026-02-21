import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Resolves the current user id from authenticated session.
 * For local testing, optional dev bypass can be enabled through env vars.
 */
export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id;
  if (sessionUserId) {
    return sessionUserId;
  }

  if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_AUTH_BYPASS === 'true') {
    return process.env.DEV_BYPASS_USER_ID ?? 'demo-user-id';
  }

  return null;
}
