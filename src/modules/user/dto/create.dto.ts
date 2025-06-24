export interface CreateUserDto {
  id: string;
  name: string;
  phoneNumber: string;
  region: string;
  type: string;
}

export type CreateDoctorDto = CreateUserDto & {
  specialities: string[];
};
