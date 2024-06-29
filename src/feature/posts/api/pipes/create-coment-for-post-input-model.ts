import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateCommentForPostInputModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(20, 300, {
    message: 'Length field title should be more 19 and less 301 simbols',
  })
  content: string;
}
