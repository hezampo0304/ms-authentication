export interface UserAuthenticatedEvent {
  eventId: string;
  eventType: 'USER_AUTHENTICATED';
  occurredAt: string;

  userId: string;
  tenantId: string;
  sessionId: string;

  provider: string;
}