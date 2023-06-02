import { ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Career } from 'src/modules/entities/Career';
import { Comment } from 'src/modules/entities/Comment';
import { CommentLike } from 'src/modules/entities/CommentLike';
import { Field } from 'src/modules/entities/Field';
import { MainCategory } from 'src/modules/entities/MainCategory';
import { Post } from 'src/modules/entities/Post';
import { PostLike } from 'src/modules/entities/PostLike';
import { RankerProfile } from 'src/modules/entities/RankerProfile';
import { Ranking } from 'src/modules/entities/Ranking';
import { SubCategory } from 'src/modules/entities/SubCategory';
import { Tier } from 'src/modules/entities/Tier';
import { User } from 'src/modules/entities/User';
import { DatabaseType } from 'typeorm';

export default registerAs('orm', () => ({
  type: 'mysql' as DatabaseType,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.NODE_ENV === 'prod' ? false : true,
  logging: process.env.NODE_ENV === 'prod' ? false : true,
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
    // todo 엔티티가 각 모듈로 들어가게 되면 이렇게 수정 : __dirname + '/**/*.entity{.ts,.js}'
    // todo 또는 엔티티는 각 모듈에서 사용하는 것 알아서 forFeature로 넣기?
  ],
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4_general_ci',
  },
}));
