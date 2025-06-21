import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { SpecialityService } from './speciality.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('speciality')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post('/create')
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.create(createSpecialityDto);
  }

  @Get('/all')
  findAll() {
    return this.specialityService.findAll();
  }
}
