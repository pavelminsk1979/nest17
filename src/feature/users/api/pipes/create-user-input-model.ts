import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserInputModel {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10, {
    message: 'Lengt field login should be more 2 and less 11 simbols',
  })
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Lengt field password should be more 5 and less 21 simbols',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Should be email',
  })
  email: string;
}
