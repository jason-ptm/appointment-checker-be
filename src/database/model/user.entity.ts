import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @PrimaryColumn({ name: 'ID' })
  id: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'PHONE_NUMBER' })
  phoneNumber: string;

  @Column({ name: 'REGION' })
  region: string;

  @Column({ name: 'TYPE' })
  email: string;
}
