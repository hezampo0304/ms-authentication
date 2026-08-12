export interface UserLoggedOutEvent {
  eventId: string;
  eventType: 'USER_LOGGED_OUT';
  occurredAt: string;

  userId: string;
  tenantId: string;
  sessionId: string;

  reason?: string;
}