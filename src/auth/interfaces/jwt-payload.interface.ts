export interface JwtPayload {
  sub: string;
  tenantId: string;
  identityId: string;
  email: string;
  provider: string;
  sessionId: string;
  jti: string;
  iat: number;
  exp: number;
}