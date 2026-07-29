export class TenantEntity {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  type: string;
  status: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}