import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CALENDAR' })
export class Calendar {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'STARTDATE' })
  startDate: Date;

  @Column({ name: 'ENDDATE' })
  endDate: Date;
}
