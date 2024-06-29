import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from '../domains/domain-blog';
import { isValidObjectId, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogInputModel } from '../api/pipes/create-blog-input-model';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async save(newBlog: BlogDocument) {
    return newBlog.save();
  }

  async deleteBlogById(blogId: string) {
    if (!isValidObjectId(blogId)) {
      return null;
    }
    const result = await this.blogModel.deleteOne({
      _id: new Types.ObjectId(blogId),
    });

    return !!result.deletedCount;
  }

  async updateBlog(blogId: string, updateBlogInputModel: CreateBlogInputModel) {
    if (!isValidObjectId(blogId)) {
      return null;
    }

    const { name, websiteUrl, description } = updateBlogInputModel;

    const result = await this.blogModel.updateOne(
      {
        _id: new Types.ObjectId(blogId),
      },

      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      },
    );

    return !!result.matchedCount;
  }

  async findBlog(blogId: string): Promise<BlogDocument | null> {
    if (!isValidObjectId(blogId)) {
      return null;
    }
    /*этот метод автоматом преобразует id в обект*/
    return this.blogModel.findById(blogId);
  }
}
