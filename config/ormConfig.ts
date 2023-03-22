import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Career } from 'src/entities/Career';
import { Comment } from 'src/entities/Comment';
import { CommentLike } from 'src/entities/CommentLike';
import { Field } from 'src/entities/Field';
import { MainCategory } from 'src/entities/MainCategory';
import { Post } from 'src/entities/Post';
import { PostLike } from 'src/entities/PostLike';
import { RankerProfile } from 'src/entities/RankerProfile';
import { Ranking } from 'src/entities/Ranking';
import { SubCategory } from 'src/entities/SubCategory';
import { Tier } from 'src/entities/Tier';
import { User } from 'src/entities/User';
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  host:
    process.env.DB_HOST_LOCAL ||
    process.env.DB_HOST_DEV ||
    process.env.DB_HOST_PROD,
  password:
    process.env.DB_PASSWORD_LOCAL ||
    process.env.DB_PASSWORD_DEV ||
    process.env.DB_PASSWORD_PROD,
  database:
    process.env.DB_DATABASE_LOCAL ||
    process.env.DB_DATABASE_DEV ||
    process.env.DB_DATABASE_PROD,
  synchronize:
    process.env.DB_SYNCHRONIZE_LOCAL === 'true' ||
    process.env.DB_SYNCHRONIZE_DEV === 'true' ||
    process.env.DB_SYNCHRONIZE_PROD === '',
  logging:
    process.env.DB_LOGGING_LOCAL === 'true' ||
    process.env.DB_LOGGING_DEV === 'true' ||
    process.env.DB_LOGGING_PROD === '',
  entities: [
    Career,
    Comment,
    CommentLike,
    Field,
    MainCategory,
    Post,
    PostLike,
    RankerProfile,
    Ranking,
    SubCategory,
    Tier,
    User,
  ],
};

export = config;
