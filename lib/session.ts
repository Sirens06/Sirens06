import { cookies } from 'next/headers';
import { GUEST_COOKIE } from '@/lib/session-constants';

export { GUEST_COOKIE };

// The guest_id cookie is created by middleware.ts on every request, so by the
// time a route handler runs it is always present.
export function getGuestId(): string {
  const id = cookies().get(GUEST_COOKIE)?.value;
  if (!id) {
    throw new Error('Guest session cookie missing — check middleware.ts matcher config');
  }
  return id;
}
