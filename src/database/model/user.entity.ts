import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Appointment } from './appointment.entity';
import { UserRole } from './userRole.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'region' })
  region: string;

  @Column({ name: 'type' })
  type: string;

  @OneToMany(() => UserRole, (userRole) => userRole.id)
  roles: UserRole[];

  @OneToMany(() => Appointment, (appointment) => appointment.id)
  appointments: Appointment[];
}
