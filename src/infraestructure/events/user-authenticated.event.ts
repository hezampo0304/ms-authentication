export interface UserAuthenticatedEvent {
  eventId: string;
  eventType: 'USER_AUTHENTICATED';
  occurredAt: string;

  userId: string;
  tenantId: string;
  sessionId: string;

  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;

  ipAddress?: string;
  userAgent?: string;

  expiresAt: string;

  provider: string;
}