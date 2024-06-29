import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

///////////////////////////////////////////////////////

/*в проэкте nest14-train2 и в конспекте 1403
есть расписаны варианты попроще*/

////////////////////////////////////////////////

/*https://docs.nestjs.com/exception-filters

  Exception filters

---ЭТО ПЕРЕХВАТ ЛЮБОГО HTTP кода ошибки

--НАДО ГЛОБАЛЬНО ПОДКЛЮЧИТЬ К ПРИЛОЖЕНИЮ
 app.useGlobalFilters(new HttpExceptionFilter());
в main.ts

*/

///////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/*ЭТО 3 вариант  сложный
ЗАДАЧА  ---вывести поле каждой
ошибки(fuild:name)
текст каждой ошибки по каждому полю
message: textError




----ВОТ ТАКОЙ ВЫВОД ОШИБКИ БУДЕТ
{
    "errors": [
        {
            "message": "Short length поля name",
            "field": "name"
        },
        {
            "message": "name must be an email",
            "field": "name"
        },
        {
            "message": "description should not be empty",
            "field": "description"
        }
    ]
}
------я специально сделал две ошибки для поля name
  @IsEmail()
  @Length(10, 20, { message: 'Short length поля name' })
  name: string;


*/
////////////////////////////////////////////////
/*
изменения также  в  файле  main.ts
 в строке     app.useGlobalPipes(new ValidationPipe()); 
   
  --- ВОТ ТАКОЙ ТАМ КОД 
      
app.useGlobalPipes(
  new ValidationPipe({
    exceptionFactory: (errors) => {
      const errorForResponse: ErrorResponseType[] = [];
      errors.forEach((e: ValidationError) => {
        const constraintsKey = Object.keys(e.constraints ?? {});
        /!*constraints это {isEmail: 'name must be an email', isLength: 'Short length поля name'}
         * --и создаётся массив ключей[isEmail,isLength]*!/

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
);*/

////////////////////////////////////////////////
export type ErrorResponseType = {
  message: string;
  field: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse: { errorsMessages: ErrorResponseType[] } = {
        errorsMessages: [],
      };

      const responseBody: any = exception.getResponse();

      responseBody.message.forEach((m) => {
        return errorResponse.errorsMessages.push(m);
      });

      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    }
  }
}
