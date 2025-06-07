import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Appointment } from './appointment.entity';
import { UserRole } from './userRole.entity';

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

  @ManyToOne(() => UserRole, (userRole) => userRole.id)
  roles: UserRole[];

  @ManyToOne(() => Appointment, (appointment) => appointment.id)
  appointments: Appointment[];
}
