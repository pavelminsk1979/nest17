import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../domains/domain-blog';
import { BlogRepository } from '../repositories/blog-repository';
import { Post, PostDocument } from '../../posts/domains/domain-post';
import { PostRepository } from '../../posts/repositories/post-repository';
import { CreatePostForBlogInputModel } from '../api/pipes/create-post-for-blog-input-model';
import { CommandHandler } from '@nestjs/cqrs';
import { PostQueryRepository } from '../../posts/repositories/post-query-repository';

export class CreatePostForBlogCommand {
  constructor(
    public blogId: string,
    public createPostForBlogInputModel: CreatePostForBlogInputModel,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
@Injectable()
export class CreatePostForBlogService {
  constructor(
    protected blogRepository: BlogRepository,
    protected postRepository: PostRepository,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected postQueryRepository: PostQueryRepository,
  ) {}

  async execute(command: CreatePostForBlogCommand) {
    const { title, content, shortDescription } =
      command.createPostForBlogInputModel;
    const blogId = command.blogId;

    /* нужно получить документ блога из базы чтобы взять от него
 поле blogName*/

    const blog: BlogDocument | null =
      await this.blogRepository.findBlog(blogId);

    if (!blog) return null;

    const blogName = blog.name;

    /* создаю документ post */
    const newPost: PostDocument = new this.postModel({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    });

    const post: PostDocument = await this.postRepository.save(newPost);

    return post._id.toString();
  }
}
