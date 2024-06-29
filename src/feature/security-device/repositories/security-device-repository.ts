import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
} from '../domains/domain-security-device';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ его В ФАЙЛ app.module
 * providers: []*/
export class SecurityDeviceRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private securityDeviceModel: Model<SecurityDeviceDocument>,
  ) {}

  async save(device: SecurityDeviceDocument) {
    return device.save();
  }

  async findDeviceByIdAndDate(deviceId: string, issuedAtRefreshToken: string) {
    return this.securityDeviceModel.findOne({ deviceId, issuedAtRefreshToken });
  }

  async findDeviceByDeviceId(deviceId: string) {
    return this.securityDeviceModel.findOne({ deviceId });
  }

  async deleteDevicesExeptCurrentDevice(userId: string, deviceId: string) {
    /* В условии { userId, deviceId: { $ne: deviceId } } мы указываем, что нужно удалить все устройства с userId, за исключением deviceId. Оператор $ne означает "не равно", поэтому мы исключаем устройство с deviceId из удаления.*/

    await this.securityDeviceModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });

    /* В случае, если не будет найдено устройств для удаления, result будет содержать объект с информацией о результате удаления, где свойство ok будет равно 1, а свойство deletedCount будет равно 0. Это означает, что операция удаления была выполнена успешно, но не было удалено ни одного документа, так как не было устройств, удовлетворяющих условию.*/

    return true;
  }

  async deleteDeviceByDeviceId(deviceId: string) {
    const result = await this.securityDeviceModel.deleteOne({ deviceId });

    if (result.deletedCount) {
      return true;
    } else {
      return null;
    }
  }

  async findDeviceByUserIdAndDeviceIdFromParam(
    userId: string,
    deviceIdFromParam: string,
  ) {
    return this.securityDeviceModel.findOne({
      userId,
      deviceId: deviceIdFromParam,
    });
  }
}
