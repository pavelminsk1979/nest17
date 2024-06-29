import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { LimitVisitService } from '../../feature/visit-limit/services/limit-visit-service';

/*хоть его я не добавляю никуда в constructor но
ему необходимо добавлять  @Injectable()  и добавлять
его в app.module.ts в  providers: []*/

@Injectable()
export class VisitLimitGuard implements CanActivate {
  constructor(protected limitVisitService: LimitVisitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const ip =
      (request.headers['x-forwarded-for'] as string) ||
      (request.socket.remoteAddress as string);

    const url = request.originalUrl;

    const date = new Date().toISOString();

    const isLimitTooMany = await this.limitVisitService.checkLimitVisits(
      ip,
      url,
      date,
    );

    if (isLimitTooMany) {
      /*  HTTP-статус код 429*/
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    } else {
      return true;
    }
  }
}
