import { RankModule } from '../rank/rank.module';
import { CommunityModule } from '../community/community.module';
import { GetCodeController } from './application/queries/get-code/get-code.controller';
import { RefreshController } from './application/commands/refresh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Field } from '../user/database/field.orm-entity';
import { Career } from '../user/database/career.orm-entity';
import { UserModule } from '../user/user.module';
import { AuthRepository } from '../user/database/auth.repository';

const authControllers = [RefreshController, GetCodeController];

@Module({
  imports: [
    TypeOrmModule.forFeature([Field, Career]),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
    CommunityModule,
    RankModule,
  ],
  controllers: [...authControllers],
  providers: [AuthService, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
