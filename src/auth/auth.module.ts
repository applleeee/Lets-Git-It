import { Field } from './../entities/Field';
import { Career } from './../entities/Career';
import { GetCodeController } from './application/queries/get-code/get-code.controller';
import { RefreshController } from './application/commands/refresh.controller';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';

const authControllers = [RefreshController, GetCodeController];

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
  ],
  controllers: [...authControllers],
  providers: [AuthService, AuthRepository, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
