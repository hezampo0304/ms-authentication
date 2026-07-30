import { TenantStatus, TenantType } from '@prisma/client';

export const TENANT_CONSTANTS = {

  TYPE: {
    TRAVEL_AGENCY: TenantType.TRAVEL_AGENCY,
    HOTEL: TenantType.HOTEL,
    AIRLINE: TenantType.AIRLINE,
    TRANSPORT_COMPANY: TenantType.TRANSPORT_COMPANY,
    TOUR_OPERATOR: TenantType.TOUR_OPERATOR,
    CORPORATE: TenantType.CORPORATE,
  },

  STATUS: {
    ACTIVE: TenantStatus.ACTIVE,
    INACTIVE: TenantStatus.INACTIVE,
    SUSPENDED: TenantStatus.SUSPENDED,
    PENDING_APPROVAL: TenantStatus.PENDING_APPROVAL,
  },

} as const;