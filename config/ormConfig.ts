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
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
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
