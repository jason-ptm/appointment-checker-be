import { Body, Controller, Post } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { SpecialityService } from './speciality.service';

@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post('/create')
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.create(createSpecialityDto);
  }
}
