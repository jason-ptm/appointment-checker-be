import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from 'src/database/model/speciality.entity';
import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality])],
  controllers: [SpecialityController],
  providers: [SpecialityService],
  exports: [SpecialityService, TypeOrmModule],
})
export class SpecialityModule {}
