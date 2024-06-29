import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityDeviceRepository } from '../repositories/security-device-repository';
import { SecurityDeviceQueryRepository } from '../repositories/security-device-query-repository';

@Injectable()
export class SecurityDeviceService {
  constructor(
    protected securityDeviceRepository: SecurityDeviceRepository,
    protected securityDeviceQueryRepository: SecurityDeviceQueryRepository,
  ) {}

  async getAllDevicesCorrectUser(
    deviceId: string,
    issuedAtRefreshToken: string,
  ) {
    const oneDevice = await this.securityDeviceRepository.findDeviceByIdAndDate(
      deviceId,
      issuedAtRefreshToken,
    );

    if (!oneDevice) return null;

    const userId = oneDevice.userId;

    return this.securityDeviceQueryRepository.getAllDevicesCorrectUser(userId);
  }

  async deleteDevicesExeptCurrentDevice(
    deviceId: string,
    issuedAtRefreshToken: string,
  ) {
    const oneDevice = await this.securityDeviceRepository.findDeviceByIdAndDate(
      deviceId,
      issuedAtRefreshToken,
    );

    if (!oneDevice) return null;

    const userId = oneDevice.userId;

    await this.securityDeviceRepository.deleteDevicesExeptCurrentDevice(
      userId,
      deviceId,
    );

    return true;
  }

  async deleteDeviceByDeviceId(
    deviceIdFromRefreshToken: string,
    deviceIdFromParam: string,
  ) {
    const device =
      await this.securityDeviceRepository.findDeviceByDeviceId(
        deviceIdFromParam,
      );

    if (!device) return null; //404

    /*   чтобы достать userId ТОГО 
       ПОЛЬЗОВАТЕЛЯ КОТОРЫЙ ДЕЛАЕТ ЗАПРОС 
       мне надо найти документ  по deviceIdFromRefreshToen*/

    const deviceCurrentUser =
      await this.securityDeviceRepository.findDeviceByDeviceId(
        deviceIdFromRefreshToken,
      );

    if (!deviceCurrentUser) return null; //404

    const userId = deviceCurrentUser.userId;

    const correctDevice =
      await this.securityDeviceRepository.findDeviceByUserIdAndDeviceIdFromParam(
        userId,
        deviceIdFromParam,
      );

    if (!correctDevice) {
      /*   403 статус код */
      throw new ForbiddenException(
        ' not delete device :andpoint-security/devices/deviceId,method-delete',
      );
    }

    return this.securityDeviceRepository.deleteDeviceByDeviceId(
      deviceIdFromParam,
    );
  }

  async logout(deviceId: string, issuedAtRefreshToken: string) {
    const oneDevice = await this.securityDeviceRepository.findDeviceByIdAndDate(
      deviceId,
      issuedAtRefreshToken,
    );

    if (!oneDevice) {
      throw new UnauthorizedException(
        "user didn't logout because refreshToken not exist in BD :andpoint-auth/logout,method - post",
      );
    }
    return this.securityDeviceRepository.deleteDeviceByDeviceId(deviceId);
  }
}
