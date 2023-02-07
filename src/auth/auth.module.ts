import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/User';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Field, Career]),
    HttpModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
