import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog-repository';
import { CreateBlogInputModel } from '../api/pipes/create-blog-input-model';
import { CommandHandler } from '@nestjs/cqrs';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public updateBlogInputModel: CreateBlogInputModel,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
@Injectable()
export class UpdateBlogService {
  constructor(protected blogRepository: BlogRepository) {}

  async execute(command: UpdateBlogCommand) {
    return this.blogRepository.updateBlog(
      command.blogId,
      command.updateBlogInputModel,
    );
  }
}
