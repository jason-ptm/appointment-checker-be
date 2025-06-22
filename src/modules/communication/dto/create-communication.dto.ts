import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import {
  COMMUNICATION_TYPE,
  COMMUNICATION_STATUS_TYPE,
} from 'src/utils/constants';

export class CreateCommunicationDto {
  @ApiProperty({
    description: 'The ID of the appointment this communication is for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  appointmentId: string;

  @ApiProperty({
    description: 'The type of communication',
    enum: Object.values(COMMUNICATION_TYPE),
    example: COMMUNICATION_TYPE.EMAIL,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The start date of the communication',
    example: '2024-01-15T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'The status of the communication',
    enum: Object.values(COMMUNICATION_STATUS_TYPE),
    example: COMMUNICATION_STATUS_TYPE.PENDING,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}
