import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { getDatabaseConfig } from './database/config';
import { getEntities } from './database/model';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { RoleModule } from './modules/role/role.module';
import { SpecialityModule } from './modules/speciality/speciality.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { UserRoleService } from './modules/user-role/user-role.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'oracle',
      ...getDatabaseConfig(),
      database: 'fisCloud',
      entities: [...getEntities()],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    UserRoleModule,
    RoleModule,
    UserRoleModule,
    AppointmentModule,
    CalendarModule,
    SpecialityModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserRoleService],
})
export class AppModule {}
