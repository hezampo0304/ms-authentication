export class ProfileResponseDto {

  id: string;

  firstName: string;

  lastName: string;

  displayName: string | null;

  email: string;

  phone: string | null;

  status: string;

  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}