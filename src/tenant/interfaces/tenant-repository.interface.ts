import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantEntity } from '../entities/tenant.entity';

export interface TenantRepositoryInterface {

    create(dto: CreateTenantDto): Promise<TenantEntity>;

    findBySlug(slug: string): Promise<TenantEntity | null>;

}