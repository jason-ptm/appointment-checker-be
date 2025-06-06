import { APPOINTMENT_STATUS } from 'src/utils/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'APPOINTMENT' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'APPOINTMEN_DATE' })
  appointmentDate: Date;

  @Column({ name: 'STATUS', default: APPOINTMENT_STATUS.PENDING })
  status: string;

  @Column({ name: 'ID_User' })
  idPatient: string;
}
