import { registerAs } from '@nestjs/config';

/**
 * cookie이라는 토큰으로 ConfigFactory를 등록할 수 있는 함수
 * @param domain cookie를 수신하는 domain입니다.
 */
export default registerAs('cookie', () => ({
  domain: process.env.COOKIE_DOMAIN,
}));
