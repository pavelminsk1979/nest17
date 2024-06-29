import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegistrationEmailResendingInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
