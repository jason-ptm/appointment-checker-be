import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Communication' })
export class Communication {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'status_' })
  status: string;

  @OneToMany(() => Communication, (communication) => communication.id)
  idAppointment: string;
}
