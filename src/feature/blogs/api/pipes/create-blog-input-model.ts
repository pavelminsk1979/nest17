/*пример создания экземпляра класса
CreateBlogInputModel :


--если  const blogInput = new CreateBlogInputModel()
будет создан инстанс --- blogInput = {
name: undefined,
  description: undefined,
   websiteUrl: undefined}

   ---но можно потом в коде значения добавлять
   blogInput.name = 'Название блога';

   /////////////////////////////////////

   https://github.com/typestack/class-validator
   ТУТ МНОЖЕСТВО ДЕКОРАТОРОВ которые
   определят правила валидации

---   @Length(10, 20) -длинна приходящей строки

---@IsEmail()  это именно емаил

----@IsNotEmpty() -обязательное поле

------@IsInt()  ---целое число,НЕОТРИЦАТЕЛЬНОЕ.Именно ЧИСЛО

------@Min(0)--- чтоб обязательно было значение

.....................

ПАЙП  дожен быть  ПОВЕШЕН,
иначе валидация не будет работать

 ДЛЯ СОЗДАНИЯ ГЛОБАЛЬНОГО ПАЙПА
app.useGlobalPipes(new ValidationPipe());
вот эту строку вставить в файл main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

.......

в файле blog-controller.ts
в методе для которого пишется данный пайп
прописать типизаци входящих данных
НЕ ЧЕРЕС ТИПИЗАЦИЮ А ЧЕРЕЗ ДАННЫЙ КЛАСС

  @Post()
  async createBlog(
    @Body() createBlogInputModel: CreateBlogInputModel,
  ): Promise<ViewBlog> {

ВАЛИДАЦИЯ ЗАРАБОТАЛА ПОСЛЕ ЗАКРЫТИЯ
И ОТКРЫТИЯ ВЕБШТОРМА!!!!

--теперь если из постмана отправить
name с малым количеством символов то будет ошибка
{
    "message": [
        "name must be longer than or equal to 10 characters"
    ],
    "error": "Bad Request",
    "statusCode": 400
}

/////////////////////////////////

Далее управление ошибкой

Exception filters

в файле src/exeption-filter.ts

*/

import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 15, { message: 'Lengt field name should be less 16 simbols' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 500, {
    message: 'Lengt field description should be less 501 simbols',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 100, {
    message: 'Lengt field websiteUrl should be less 101 simbols',
  })
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
