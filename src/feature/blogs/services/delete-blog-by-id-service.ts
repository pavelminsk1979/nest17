import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/*sqrs конспект 1501*/
export class DeleteBlogByIdCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogByIdCommand)
@Injectable()
export class DeleteBlogByIdService
  implements ICommandHandler<DeleteBlogByIdCommand>
{
  constructor(protected blogRepository: BlogRepository) {}

  async execute(command: DeleteBlogByIdCommand): Promise<boolean | null> {
    return this.blogRepository.deleteBlogById(command.blogId);
  }
}
