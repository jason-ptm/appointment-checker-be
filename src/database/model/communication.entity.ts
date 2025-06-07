import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Communication, (communication) => communication.id)
  idAppointment: string;
}
