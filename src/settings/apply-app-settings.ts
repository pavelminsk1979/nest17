import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorResponseType, HttpExceptionFilter } from '../exeption-filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export const applyAppSettings = (app: INestApplication) => {
  /*без этой команды при деплое на ВЕРСЕЛ будут
  падать ошибки */
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  /*ДЛЯ СОЗДАНИЯ ГЛОБАЛЬНОГО ПАЙПА
  КОД В АРГУМЕНТЕ --это чтоб если pipe валидация
  не прошла то выводилась ошибка определенного
  формата---поле конкретное и текст всех
  ошибок для этого поля*/
  app.useGlobalPipes(
    new ValidationPipe({
      /*    это настройка чтоб  работал  (@Transform(({ value }: TransformFnParams) =>
            typeof value === 'string' ? value.trim() : value,
          ))  -- ибо нету декоратора @Trim()*/
      transform: true,
      //выводит только одну ошибку для одного поля
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorForResponse: ErrorResponseType[] = [];
        errors.forEach((e: ValidationError) => {
          const constraintsKey = Object.keys(e.constraints ?? {});
          /*constraints это {isEmail: 'name must be an email', isLength: 'Short length поля name'}
           * --и создаётся массив ключей[isEmail,isLength]*/

          constraintsKey.forEach((ckey: string) => {
            errorForResponse.push({
              message: e.constraints?.[ckey] ?? 'default message',
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorForResponse);
      },
    }),
  );

  /*https://docs.nestjs.com/exception-filters
 
   Exception filters
   -он в файле exception-filter.ts
 
 ---ЭТО ПЕРЕХВАТ ЛЮБОГО HTTP кода ошибки
 
 --тут  ГЛОБАЛЬНО ПОДКЛЮЧаю К ПРИЛОЖЕНИЮ*/
  app.useGlobalFilters(new HttpExceptionFilter());
};
