import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from 'src/database/model/calendar.entity';
import { ErrorResponse } from 'src/utils/model/error';
import { Like, Repository } from 'typeorm';
import { CreateCalendarDto } from './dto/create-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
  ) {}

  async create(
    createCalendarDto: CreateCalendarDto,
  ): Promise<ErrorResponse | Calendar> {
    try {
      const calendar = this.calendarRepository.create({
        ...createCalendarDto,
      });

      return this.calendarRepository.save(calendar);
    } catch (error) {
      console.log(error);
      return {
        message: 'Error creating calendar',
      };
    }
  }

  findByKey(key: string): Promise<Array<Calendar>> {
    return this.calendarRepository.find({
      where: {
        key: Like(`%${key}%`),
      },
    });
  }
}
