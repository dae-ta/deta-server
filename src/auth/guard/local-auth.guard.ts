import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    // 주어진 context에 대해 LocalStrategy를 사용한 인증이 성공적으로 이루어졌는지 확인
    const can = await super.canActivate(context);
    if (can) {
      const request = context.switchToHttp().getRequest();
      // 세션에 사용자 정보를 저장(serializeUser 실행)
      await super.logIn(request);
    }

    return true;
  }
}
