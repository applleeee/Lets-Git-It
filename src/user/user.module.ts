import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Field, Career]), HttpModule],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
