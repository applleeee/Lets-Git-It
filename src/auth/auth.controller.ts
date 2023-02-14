import { AuthService } from './auth.service';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { GithubCodeDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  signIn(@Body() githubCode: GithubCodeDto) {
    return this.authService.signIn(githubCode);
  }

  @Post('/sign-up')
  signUp(@Body() userData: SignUpDto) {
    return this.authService.signUp(userData);
  }

  @Get('/category')
  getAuthCategory() {
    return this.authService.getAuthCategory();
  }
}
