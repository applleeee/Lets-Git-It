import { RankModule } from '../rank/rank.module';
import { CommunityModule } from '../community/community.module';
import { GetCodeController } from './application/queries/get-code/get-code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { RefreshToken } from './database/refresh-token.orm-entity';
import { RefreshTokenRepository } from './database/refresh-token.repository';
import { REFRESH_TOKEN_REPOSITORY } from './auth.di-tokens';
import { RefreshTokenMapper } from './mapper/refresh-token.mapper';

const authControllers = [GetCodeController];

const repositories = [
  { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenRepository },
];

const mappers = [RefreshTokenMapper];

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
    // CommunityModule,
    RankModule,
  ],
  controllers: [...authControllers],
  providers: [AuthService, ...repositories, ...mappers],
  exports: [AuthService],
})
export class AuthModule {}
