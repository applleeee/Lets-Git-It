import { RankModule } from '../rank/rank.module';
import { CommunityModule } from '../community/community.module';
import { GetCodeController } from './application/queries/get-code/get-code.controller';
import { RefreshController } from './application/commands/refresh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { User } from '../user/database/entity/user.orm-entity';

const authControllers = [RefreshController, GetCodeController];

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
    // CommunityModule,
    // RankModule,
  ],
  controllers: [...authControllers],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
