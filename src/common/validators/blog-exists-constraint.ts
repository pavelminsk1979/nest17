import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogRepository } from '../../feature/blogs/repositories/blog-repository';

@ValidatorConstraint({ async: true })
/*надо добалять в app.module.ts в provide
 BlogExistsConstraint*/
export class BlogExistsConstraint implements ValidatorConstraintInterface {
  constructor(private blogRepository: BlogRepository) {}

  async validate(blogId: string, args?: ValidationArguments) {
    //console.log(blogId);
    const blog = await this.blogRepository.findBlog(blogId);

    return !!blog;
  }

  defaultMessage(args?: ValidationArguments) {
    return 'Blog does not exist';
  }
}
