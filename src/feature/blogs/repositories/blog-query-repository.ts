import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Blog, BlogDocument } from '../domains/domain-blog';
import { ViewArrayBlog, ViewBlog } from '../api/types/views';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogs(queryParamsBlog: QueryParamsInputModel) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      queryParamsBlog;

    const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

    const filter: { name?: { $regex: string; $options: string } } = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const blogs: BlogDocument[] = await this.blogModel
      .find(filter)

      .sort({ [sortBy]: sortDirectionValue })

      .skip((pageNumber - 1) * pageSize)

      .limit(pageSize)

      .exec();

    const totalCount: number = await this.blogModel.countDocuments(filter);

    const pagesCount: number = Math.ceil(totalCount / pageSize);

    const arrayBlogs: ViewBlog[] = blogs.map((blog: BlogDocument) => {
      return this.createViewModelBlog(blog);
    });
    /*   console.log('------------------');
       console.log(typeof pageNumber);
       console.log('pageNumber');
       console.log(typeof pageSize);
       console.log('pageSize');
       console.log('------------------');*/

    const viewBlogs: ViewArrayBlog = {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: arrayBlogs,
    };
    return viewBlogs;
  }

  async getBlogById(blogId: string) {
    if (!isValidObjectId(blogId)) {
      return null;
    }
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });

    if (blog) {
      return this.createViewModelBlog(blog);
    } else {
      return null;
    }
  }

  createViewModelBlog(blog: BlogDocument): ViewBlog {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
