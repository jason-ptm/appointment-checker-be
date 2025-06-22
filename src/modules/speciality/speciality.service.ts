import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Speciality } from 'src/database/model/speciality.entity';
import { ErrorResponse } from 'src/utils/model/error';
import { Repository } from 'typeorm';
import { CreateSpecialityDto } from './dto/create-speciality.dto';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectRepository(Speciality)
    private readonly specialityRepository: Repository<Speciality>,
  ) {}

  async create({
    name,
  }: CreateSpecialityDto): Promise<Speciality | ErrorResponse> {
    try {
      const speciality = this.specialityRepository.create({ name });

      return this.specialityRepository.save(speciality);
    } catch (error: unknown) {
      console.log(error);
      return {
        message: 'Error creating speciality',
      };
    }
  }

  async findAll(): Promise<Array<Speciality> | ErrorResponse> {
    try {
      return this.specialityRepository.find();
    } catch (error: unknown) {
      console.log(error);
      return {
        message: 'Error retrieving specialities',
      };
    }
  }

  async findByKey(key: string): Promise<Speciality | null> {
    return this.specialityRepository.findOne({
      where: {
        name: key,
      },
    });
  }
}
