import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './community.service';
import { SubCategory } from '../entities/SubCategory';
import { MainCategory } from '../entities/MainCategory';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';
import { PostLike } from 'src/entities/PostLike';
import { Comment } from 'src/entities/Comment';
import { RankerProfile } from 'src/entities/RankerProfile';
import { Ranking } from 'src/entities/Ranking';
import { Tier } from 'src/entities/Tier';
import { CommentLike } from 'src/entities/CommentLike';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubCategory,
      MainCategory,
      Post,
      User,
      PostLike,
      Comment,
      CommentLike,
      RankerProfile,
      Ranking,
      Tier,
    ]),
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    CommunityRepository,
    AuthService,
    JwtService,
    JwtStrategy,
  ],
})
export class CommunityModule {}
