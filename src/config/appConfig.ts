import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  corsOrigin: process.env.CORS_ORIGIN,
  cookieSecretKey: process.env.COOKIE_SECRET_KEY,
  swagger: {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  },
}));
