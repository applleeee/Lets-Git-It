import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

export default registerAs('orm', () => ({
  type: 'mysql' as DatabaseType,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.NODE_ENV === 'prod' ? false : true,
  autoLoadEntities: process.env.NODE_ENV === 'prod' ? false : true,
  logging: process.env.NODE_ENV === 'prod' ? false : true,
  // todo 엔티티가 각 모듈로 들어가게 되면 이렇게 수정 :
  entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4_general_ci',
  },
}));
