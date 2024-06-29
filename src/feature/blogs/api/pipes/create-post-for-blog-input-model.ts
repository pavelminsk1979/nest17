import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostForBlogInputModel {
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
}
