import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class NewPasswordInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(6, 20, {
    message: 'Lengt field newPassword should be more 5 and less 21 simbols',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  recoveryCode: string;
}
