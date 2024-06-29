import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
} from '../domains/domain-security-device';
import { ViewSecurityDevice } from '../api/types/views';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ его В ФАЙЛ app.module
 * providers: []*/
export class SecurityDeviceQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private securityDeviceModel: Model<SecurityDeviceDocument>,
  ) {}

  async getAllDevicesCorrectUser(userId: string) {
    /* Если метод getAllDevicesCorrectUser не найдет ни одного устройства для указанного userId, он вернет пустой массив.*/

    const array: SecurityDeviceDocument[] = await this.securityDeviceModel.find(
      { userId },
    );

    if (array.length === 0) return null;

    const viewArray: ViewSecurityDevice[] = array.map(
      (securityDevice: SecurityDeviceDocument) => {
        return this.createViewModelSecurityDevice(securityDevice);
      },
    );

    return viewArray;
  }

  createViewModelSecurityDevice(
    securityDevice: SecurityDeviceDocument,
  ): ViewSecurityDevice {
    return {
      ip: securityDevice.ip,
      title: securityDevice.nameDevice,
      lastActiveDate: securityDevice.issuedAtRefreshToken,
      deviceId: securityDevice.deviceId,
    };
  }
}
