import {
  AuthSignInOkResDto,
  AuthSignInWrongCodeDto,
  AuthSignUpCreatedDto,
  AuthSignInUnauthorizedResDto,
  AuthCategoryOkDto,
} from './dto/auth-res.dto';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @author MyeongSeok
   * @description 로그인
   * @param githubCode githubCode
   */
  @Post('/sign-in')
  @ApiOperation({
    summary: '로그인',
    description: 'github code를 Body로 받아 accessToken을 리턴합니다.',
  })
  @ApiOkResponse({
    description: '로그인에 성공하여 accessToken을 리턴합니다.',
    type: AuthSignInOkResDto,
  })
  @ApiUnauthorizedResponse({
    description: '가입되지 않은 유저입니다.',
    type: AuthSignInUnauthorizedResDto,
  })
  @ApiBadRequestResponse({
    description: 'GitHub code에 문제가 있습니다.',
    type: AuthSignInWrongCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() githubCode: GithubCodeDto,
  ): Promise<AuthSignInOkResDto | AuthSignInUnauthorizedResDto> {
    return this.authService.signIn(githubCode);
  }

  /**
   * @author MyeongSeok
   * @description 회원가입
   * @param userData
   */
  @Post('/sign-up')
  @ApiOperation({
    summary: '회원가입',
    description:
      'userName, githubId, fieldId, careerId, isKorean 등 유저의 정보를 받아 회원가입 처리 이후  accessToken을 리턴합니다.',
  })
  @ApiOkResponse({
    description: '회원가입이 되어 accessToken을 리턴합니다.',
    type: AuthSignUpCreatedDto,
  })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() userData: SignUpWithUserNameDto) {
    return this.authService.signUp(userData);
  }

  /**
   * @author MyeongSeok
   * @description 회원가입 시 유저의 개인정보 선택지를 제공합니다.
   */
  @Get('/category')
  @ApiOperation({
    summary: '유저 정보 카테고리',
    description: '회원가입 시 유저의 개인정보 선택지를 제공합니다.',
  })
  @ApiOkResponse({
    description: '개발 분야, 개발 경력에 대한 카테고리를 리턴합니다.',
    type: AuthCategoryOkDto,
  })
  @HttpCode(HttpStatus.OK)
  getAuthCategory() {
    return this.authService.getAuthCategory();
  }
}
