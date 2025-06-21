import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Calendar' })
export class Calendar {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date' })
  endDate: string;

  @Column()
  key: string;
}
