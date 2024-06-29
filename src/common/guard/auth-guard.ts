import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/*
подключаю данный ГАРД для всех эндпоинтов user и поэтому
подключение в файле user-controller.ts
@UseGuards(AuthGuard) - вот такой строкой подключается 
сверху над  @Controller('users')

@UseGuards(AuthGuard)
@Controller('users')
*/
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (request.headers['authorization'] === 'Basic YWRtaW46cXdlcnR5') {
      return true;
    } else {
      /* В Nest.js фреймворке, UnauthorizedException является
       встроенным классом, который вызывает HTTP-статус код 401*/
      throw new UnauthorizedException();
    }
  }
}
