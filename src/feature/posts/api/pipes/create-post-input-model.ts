import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { BlogExistsConstraint } from '../../../../common/validators/blog-exists-constraint';
import { Transform } from 'class-transformer';

export class CreatePostInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 30, { message: 'Lengt field title should be less 31 simbols' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 100, {
    message: 'Lengt field shortDescription should be less 101 simbols',
  })
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 1000, {
    message: 'Lengt field content should be less 1001 simbols',
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  /* соглашение по наименованию , принятое в class-validator.
   Суффикс Constraint указывает на то, что это кастомный валидатор.
   Префикс BlogExists описывает, что именно проверяет этот валидатор - существование блога.*/
  @Validate(BlogExistsConstraint)
  blogId: string;
}

/*
Во-первых, стоит отметить, что в TypeScript/JavaScript существует библиотека class-validator, которая предоставляет набор встроенных валидаторов и позволяет создавать кастомные валидаторы. Эта библиотека широко используется в фреймворках, таких как NestJS, для валидации входных данных.

  Что такое @Validate(BlogExistsConstraint)?

  Это декоратор из библиотеки class-validator, который применяется к свойствам DTO (Data Transfer Object) или моделей.
  Он позволяет использовать кастомные валидаторы, такие как BlogExistsConstraint.
  Когда свойство blogId в DTO будет валидироваться, class-validator автоматически вызовет логику валидации, определенную в классе BlogExistsConstraint.
  Теперь рассмотрим, что такое BlogExistsConstraint:

  Это класс, который реализует интерфейс ValidatorConstraintInterface из class-validator.
  Он содержит две обязательные методы: validate() и defaultMessage().
validate() - это асинхронный метод, который проверяет, существует ли блог с указанным blogId. Он возвращает true, если блог существует, и false в противном случае.
defaultMessage() - это метод, который возвращает сообщение об ошибке, если валидация не пройдена.
  Почему такое имя функции - BlogExistsConstraint?

  Это следует соглашению, принятому в class-validator.
  Суффикс Constraint указывает на то, что это кастомный валидатор.
  Префикс BlogExists описывает, что именно проверяет этот валидатор - существование блога.
  Такое именование позволяет легко понять, что делает данный валидатор, и облегчает поддержку и расширение кода в будущем. Например, если вам понадобится проверять существование других сущностей, вы можете создать похожие валидаторы, такие как UserExistsConstraint или ProductExistsConstraint.*/

//////////////////////////////////////////////////////////////
