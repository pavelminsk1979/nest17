import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;

/*безопасный девайс НЕ ХАКЕРА А МОЙ*/
@Schema()
export class SecurityDevice {
  @Prop({ required: true })
  deviceId: string;
  @Prop({ required: true })
  issuedAtRefreshToken: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  nameDevice: string;
}

export const SecurityDeviceShema = SchemaFactory.createForClass(SecurityDevice);
