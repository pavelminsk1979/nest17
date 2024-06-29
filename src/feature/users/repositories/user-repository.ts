import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../domains/domain-user';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ UsersRepository В ФАЙЛ app.module
 * providers: [AppService,UsersService,UsersRepository]*/
export class UsersRepository {
  constructor(
    /* вот тут моделька инжектится
    именно декоратор  @InjectModel 
      -- (User.name)  регистрируется по имени
       также как в   app.module  в  imports
      ---userModel - это  свойство текущего класса ,
       это будет ТОЖЕ КЛАСС(это Моделька от mongoose).*/

    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async save(newUser: UserDocument) {
    return newUser.save();
  }

  async isExistLogin(login: string): Promise<boolean> {
    const result = await this.userModel.findOne({ login });
    return !!result;
  }

  async isExistEmail(email: string): Promise<boolean> {
    const result = await this.userModel.findOne({ email });
    return !!result;
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  }

  async findUserByCode(code: string) {
    return this.userModel.findOne({ confirmationCode: code });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async deleteUserById(userId: string) {
    const result = await this.userModel.deleteOne({
      _id: new Types.ObjectId(userId),
    });

    /*  Переменная result будет содержать обьект и в нем несколько
      свойств ---использую свойство  deletedCount: число,
        представляющее количество удаленных документов.
        и преобразую число в булевое значение */
    return !!result.deletedCount;
  }

  async getUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }
}
