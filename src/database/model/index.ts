import { Appointment } from './appointment.entity';
import { Calendar } from './calendar.entity';
import { Doctor } from './doctor.entity';
import { DoctorCalendar } from './doctorCalendar.entity';
import { Role } from './role.entity';
import { Speciality } from './speciality.entity';
import { SpecialityDoctor } from './specialityDoctor.entity';
import { User } from './user.entity';

export const getEntities = () => [
  User,
  Role,
  Doctor,
  Speciality,
  SpecialityDoctor,
  Calendar,
  DoctorCalendar,
  Appointment,
];
