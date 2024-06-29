import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigurationType } from '../../settings/env-configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenJwtService {
  expirationAccessToken: string;
  expirationRefreshToken: string;

  constructor(private configService: ConfigService<ConfigurationType, true>) {
    this.expirationAccessToken = '10s';
    this.expirationRefreshToken = '20s';
  }

  async createAccessToken(userId: string) {
    const secretAccessToken = this.configService.get(
      'authSettings.ACCESSTOKEN_SECRET',
      { infer: true },
    );
    const accessToken = jwt.sign({ userId: userId }, secretAccessToken, {
      expiresIn: this.expirationAccessToken,
    });

    return accessToken;
  }

  async createRefreshToken(deviceId: string) {
    /*внутри будет 2 значения deviceId и дата создания */

    const issuedAtRefreshToken = new Date().toISOString();

    const secretRefreshToken = this.configService.get(
      'authSettings.RefreshTOKEN_SECRET',
      { infer: true },
    );
    const refreshToken = jwt.sign(
      { deviceId, issuedAtRefreshToken },
      secretRefreshToken,
      {
        expiresIn: this.expirationRefreshToken,
      },
    );

    return { refreshToken, issuedAtRefreshToken };
  }

  async checkAccessToken(token: string) {
    try {
      const secretAccessToken = this.configService.get(
        'authSettings.ACCESSTOKEN_SECRET',
        { infer: true },
      );

      const result = (await jwt.verify(token, secretAccessToken)) as {
        userId: string;
      };
      return result.userId;
    } catch (error) {
      //console.log(' FILE token-jwt-service.ts' + error);
      return null;
    }
  }

  async checkRefreshToken(
    refreshToken: string,
  ): Promise<{ deviceId: string; issuedAtRefreshToken: string } | null> {
    try {
      const secretRefreshToken = this.configService.get(
        'authSettings.RefreshTOKEN_SECRET',
        { infer: true },
      );

      const result = (await jwt.verify(refreshToken, secretRefreshToken)) as {
        deviceId: string;
        issuedAtRefreshToken: string;
      };

      return result;
    } catch (error) {
      //console.log(' FILE token-jwt-service.ts' + error);
      return null;
    }
  }
}
