import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegistrationInputModel {
  @IsString()
  @IsNotEmpty()
  /*  обязательно установить настройку  transform: true,  в 
    глобальном пайпе---это поиском найти 
    app.useGlobalPipes(
          new ValidationPipe({
                 transform: true,*/
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(3, 10, {
    message: 'Lengt field login should be more 2 and less 11 simbols',
  })
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(6, 20, {
    message: 'Lengt field password should be more 5 and less 21 simbols',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
