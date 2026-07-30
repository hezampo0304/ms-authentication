import { CredentialType, IdentityProvider, UserStatus } from '@prisma/client';

export const AUTH_CONSTANTS = {
  PROVIDERS: {
    LOCAL: IdentityProvider.LOCAL,
    GOOGLE: IdentityProvider.GOOGLE,
    MICROSOFT: IdentityProvider.MICROSOFT,
    APPLE: IdentityProvider.APPLE,
    GITHUB: IdentityProvider.GITHUB,
  },

  CREDENTIAL_TYPES: {
    PASSWORD: CredentialType.PASSWORD,
    PASSKEY: CredentialType.PASSKEY,
    TOTP: CredentialType.TOTP,
    RECOVERY_CODE: CredentialType.RECOVERY_CODE,
  },

  USER_STATUS: {
    INVITED: UserStatus.INVITED,
    ACTIVE: UserStatus.ACTIVE,
    LOCKED: UserStatus.LOCKED,
    DISABLED: UserStatus.DISABLED,
  },

  TENANT_TYPES: {
    TRAVEL_AGENCY: 'TRAVEL_AGENCY',
    HOTEL: 'HOTEL',
    AIRLINE: 'AIRLINE',
    TRANSPORT_COMPANY: 'TRANSPORT_COMPANY',
    TOUR_OPERATOR: 'TOUR_OPERATOR',
    CORPORATE: 'CORPORATE',
  },
} as const;