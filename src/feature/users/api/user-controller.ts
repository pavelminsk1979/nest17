import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user-service';
import { UserQueryRepository } from '../repositories/user-query-repository';
import { CreateUserInputModel } from './pipes/create-user-input-model';
import { AuthGuard } from '../../../common/guard/auth-guard';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';

/*подключаю данный ГАРД для всех эндпоинтов user и поэтому
подключение
Это Basik авторизация*/
@UseGuards(AuthGuard)
@Controller('users')
/* @Controller()-- декоратор,
 который применяется к классу , указывает,
 что этот класс является контроллером. Контроллеры в NestJS отвечают за
  обработку HTTP-запросов и определение маршрутов
  В аргументе   ('users')   это URL на который
  запросы придут и данный controller  их  обработает
  ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ UsersController В ФАЙЛ app.module
  controllers: []*/
export class UsersController {
  /* Здесь используется механизм внедрения зависимостей.
    Когда экземпляр данного класса  создается, NestJS автоматически
   внедряет экземпляры классов UsersService и UserQueryRepository */
  constructor(
    protected usersService: UsersService,
    protected userQueryRepository: UserQueryRepository,
  ) {}

  /*@HttpCode(HttpStatus.OK)-чтобы статус код возвращать
    управляемо..только тут прописать
    ЕСЛИ ПО УМОЛЧАНИЮ(не прописывать такой декоратор)
    то код успешный  взависимости от метода post/delete*/

  /*Nest.js автоматически возвращает следующие
  HTTP-статус коды по умолчанию:
  post 201,get 200, delete 200, put 200
  ....
  а ошибки по умолчанию
  post 400,get 404, delete 404, put 400*/
  @HttpCode(HttpStatus.CREATED)
  @Post()
  /* ИЗ БОДИ ВОЗМУ ПРИХОДЯЩИЕ ДАННЫЕ
  @Body() createUserInputModel---имя (createUserInputModel)
  тут я сам создаю  а
  в постмане когда запрос отправляю это обьект с
  данными
  ----приходит JSON от фронта
--далее JSON трансформируется в класс и валидация полей
внутри класса с помощью декораторов (ЭТО И ЕСТЬ
ПАЙП - он и преобразователь( JSON  преобразует
 в класс в данном случае-ЭТО В ДРУГОМ ФАЙЛЕ)
ПАЙП  -он также валидатор-проверяет на входе
данные от фронта ... если в пайпе чтото не
провалидировано тогда ошибка и эту
ошибку словит exeption filter(его надо подключить
в main. ts)*/
  async createUser(@Body() createUserInputModel: CreateUserInputModel) {
    const userId: string =
      await this.usersService.createUser(createUserInputModel);

    const user = await this.userQueryRepository.getUserById(userId);

    if (user) {
      return user;
    } else {
      /*HTTP-код 404*/
      throw new NotFoundException('user not found:andpoint-post,url-users');
    }
  }

  @Get()
  async getUsers(@Query() queryParamsUserInputModel: QueryParamsInputModel) {
    const users = await this.userQueryRepository.getUsers(
      queryParamsUserInputModel,
    );
    return users;
  }

  /*@Delete(':id')
  --тут id это uriПараметр он в урле и из
    постмана запрос таким будет http://localhost:3000/users/66477c549c39ecbc48a29f70
    айдишку корректную по длинне  прописывай иначе будет 500 ошибка */

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')

  /*  @Param('id') userId: string---обязательно декоратор добавить
    который определит что это значение из ПАРАМЕТРА а положить значение  из параметра я могу в любую переменную-как
    хочу так и называю*/
  async deleteUserById(@Param('id') userId: string) {
    const isDeleteUserById = await this.usersService.deleteUserById(userId);
    if (isDeleteUserById) {
      return;
    } else {
      /*соответствует HTTP статус коду 404*/
      throw new NotFoundException(
        'user not found:andpoint-delete,url-users/id',
      );
    }
  }
}

/*
@Get(':id1')
МОЖНО ПАРАМЕТРЫ ПО ДРУГОМУ ПРОПИСАТЬ НО
 ТОГДА НАДО ЧТОБ НАЗВАНИЯ id СОВПАДАЛИ
   getUserById(@Param() params: { id1: string }) {

}*/

/*
ВОЗВРАЩАЕМЫЙ КОД HTTP
ВОТ ТАКОЙ ВАРИАНТ СКАЗАЛИ НЕ ПРАВИЛЬНЫЙ

@Delete(':id')
async deleteUserById(@Param('id') userId: string, @Res() response: Response) {
  const isDeleteUserById = await this.usersService.deleteUserById(userId);
  if (isDeleteUserById) {
    response.status(STATUS_CODE.NO_CONTENT_204).send();
  } else {
    response.status(STATUS_CODE.NOT_FOUND_404).send();
  }}}


  НАДО ВОТ ТАКОЙ ВАРИАНТ!!!
  -@HttpCode(HttpStatus.ACCEPTED)
  или
   @HttpCode(HttpStatus.OK)-чтобы статус код возвращать
    управляемо..только тут прописать
    ЕСЛИ ПО УМОЛЧАНИЮ(не прописывать такой декоратор)
    то код успешный  200
    ........
     @HttpCode(HttpStatus.ACCEPTED)
     @Delete(':id')
async deleteUserById(@Param('id') userId: string, @Res() response: Response) {
  const isDeleteUserById = await this.usersService.deleteUserById(userId);
  if (isDeleteUserById) {
    return
  } else {
    throw new NotFoundException('blog not found');
  }}}

 ------ NotFoundException  эти команды различные
 и в них заложены различные коды  (В ЭТОЙ 404)

  */
