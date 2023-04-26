import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};

export const cookieConstants = {
  // domain:
  //   process.env.COOKIE_DOMAIN || process.env.COOKIE_DOMAIN_DEV || 'localhost',
  path: '/',
  httpOnly: true,
  maxAge: Number(jwtConstants.jwtRefreshExpiresIn) * 1000,
  // sameSite: 'none' as const,
  secure: true,
  signed: true,
};
