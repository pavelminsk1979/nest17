import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenJwtService } from '../service/token-jwt-service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(protected tokenJwtService: TokenJwtService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies.refreshToken;

    //console.log(refreshToken);

    const result = await this.tokenJwtService.checkRefreshToken(refreshToken);

    if (result) {
      const { deviceId, issuedAtRefreshToken } = result;

      request['deviceId'] = deviceId;

      request['issuedAtRefreshToken'] = issuedAtRefreshToken;

      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
