import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LimitVisitDocument = HydratedDocument<LimitVisit>;
///////////////////////
/*
КОГДА СХЕМА СОЗДАНА НАДО В ФАЙЛЕ app.module.ts 
внутрь массива imports добавить
  
MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  }])

  */
@Schema()
export class LimitVisit {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  date: string;
}

export const LimitVisitSchema = SchemaFactory.createForClass(LimitVisit);

/*

для использования модельки или для использования документа созданого
моделькой  в классе в котором использовать хочу
добавить в конструктор

export class UsersRepository {

  constructor(
     вот тут моделька инжектится
    именно декоратор  @InjectModel
      -- (User.name)  регистрируется по имени
       также как в   app.module  в  imports
      ---userModel - это  свойство текущего класса ,
       это и будет  Моделька от mongoose и ниже в классе
       ее и буду использовать  примерно так -
       - await this.userModel.deleteOne.

    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}*/
