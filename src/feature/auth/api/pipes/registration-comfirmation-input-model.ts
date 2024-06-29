import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegistrationConfirmationInputModel {
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
  code: string;
}
