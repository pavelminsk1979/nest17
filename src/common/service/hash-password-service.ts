import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * providers: [AppService,UsersService]*/
export class HashPasswordService {
  async generateHash(password: string) {
    /* (10)--количество раундов --Чем больше раундов, тем более
    сложной и безопасной будет соль
    Обычно рекомендуется использовать значение от 10 до 14
    -- информация о количестве раундов,
     которые были использованы при создании хеша, эта
      инфа сохранится в самом хеше.
      Когда вы вызываете bcrypt.compare(), библиотека
       определяет, сколько раундов было использовано,
        и использует это же количество при проверке пароля.
        --- можно вместо  раундов   использовать
        , что пользователь передаст собственное значение соли
        
        const mySalt = 'yit765';
await hashPasswordService.generateHash('myPassword', mySalt);*/

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async checkPassword(password: string, hash: string) {
    /*
    -- ЛОГИНИЗАЦИЯ  БУДЕТ УСПЕШНОЙ-андпоинт auth/login
    и вернется фронту accessToken
   -- метод  compare примет пароль и хэш
      хэш-будет в базе данных
      метод  compare проверит ---на основе ЭТОГО ЛИ пароля
      был создан хэш  и вернет труе*/

    return bcrypt.compare(password, hash);
  }
}
