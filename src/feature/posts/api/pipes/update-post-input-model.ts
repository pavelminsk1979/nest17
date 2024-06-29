import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { BlogExistsConstraint } from '../../../../common/validators/blog-exists-constraint';
import { Transform } from 'class-transformer';

export class UpdatePostInputModel {
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
