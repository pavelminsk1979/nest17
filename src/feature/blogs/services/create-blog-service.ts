import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../domains/domain-blog';
import { BlogRepository } from '../repositories/blog-repository';
import { CreateBlogInputModel } from '../api/pipes/create-blog-input-model';
import { CommandHandler } from '@nestjs/cqrs';

export class CreateBlogCommand {
  constructor(public createBlogInputModel: CreateBlogInputModel) {}
}

@CommandHandler(CreateBlogCommand)
@Injectable()
export class CreateBlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    protected blogRepository: BlogRepository,
  ) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, websiteUrl, description } = command.createBlogInputModel;

    const newBlog: BlogDocument = new this.blogModel({
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });

    const blog: BlogDocument = await this.blogRepository.save(newBlog);

    return blog._id.toString();
  }
}
