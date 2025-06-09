import { Appointment } from './appointment.entity';
import { Calendar } from './calendar.entity';
import { Communication } from './communication.entity';
import { Doctor } from './doctor.entity';
import { DoctorCalendar } from './doctorCalendar.entity';
import { Role } from './role.entity';
import { Speciality } from './speciality.entity';
import { SpecialityDoctor } from './specialityDoctor.entity';
import { User } from './user.entity';
import { UserRole } from './userRole.entity';

export const getEntities = () => [
  Appointment,
  Calendar,
  Communication,
  Doctor,
  DoctorCalendar,
  Role,
  Speciality,
  SpecialityDoctor,
  User,
  UserRole,
];
