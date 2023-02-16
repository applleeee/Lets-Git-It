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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() githubCode: GithubCodeDto) {
    return this.authService.signIn(githubCode);
  }

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() userData: SignUpWithUserNameDto) {
    return this.authService.signUp(userData);
  }

  @Get('/category')
  @HttpCode(HttpStatus.OK)
  getAuthCategory() {
    return this.authService.getAuthCategory();
  }
}
