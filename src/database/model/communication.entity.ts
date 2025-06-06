import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'COMMUNICATION' })
export class Communication {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'TYPE' })
  type: string;

  @Column({ name: 'START_DATE' })
  startDate: Date;

  @Column({ name: 'STATUS' })
  status: string;

  @Column({ name: 'ID_APPOINTMENT' })
  idAppointment: string;
}
