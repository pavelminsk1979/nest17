import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './settings/env-configuration';
import cookieParser from 'cookie-parser';

/* вход в приложение
тут происходит настройка и запуск приложения

документация nest
https://docs.nestjs.com/*/
async function bootstrap() {
  /*  класс создает приложение на основе МОДУЛЯ
 NestFactory.create(AppModule) - Внизу строка кода создает экземпляр
  приложения NestJS на основе модуля AppModule(он в аргументе). AppModule - это корневой
   модуль вашего приложения (ОН СОЗДАЁТСЯ В ФАЙЛЕ app.module)
   который определяет все импорты, контроллеры
    и провайдеры, необходимые для функционирования вашего приложения.
     NestFactory - это класс, предоставляемый NestJS, который
      предоставляет статические методы для создания экземпляра
      приложения*/
  const app = await NestFactory.create(AppModule);

  // Применяем cookieParser
  app.use(cookieParser());

  /*  эта функция в файле   src/settings/apply-app-settings.ts
  и там содержиться код который был ранее в этом
  файле --- ЭТО ПЕРЕНОС КОДА В ДР ФАЙЛ*/
  applyAppSettings(app);
  ///////////////////////////////////////

  const config = app.get(ConfigService<ConfigurationType, true>);
  const port = config.get('apiSettings', { infer: true }).PORT;

  await app.listen(port, () => {
    console.log(`Application is listen  port ${port}`);
  });
}

bootstrap();
