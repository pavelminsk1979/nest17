import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogQueryRepository } from '../repositories/blog-query-repository';
import { ViewBlog } from './types/views';
import { PostQueryRepository } from '../../posts/repositories/post-query-repository';
import {
  PostWithLikesInfo,
  ViewModelWithArrayPosts,
} from '../../posts/api/types/views';
import { CreateBlogInputModel } from './pipes/create-blog-input-model';
import { CreatePostForBlogInputModel } from './pipes/create-post-for-blog-input-model';
import { DeleteBlogByIdCommand } from '../services/delete-blog-by-id-service';
import { UpdateBlogCommand } from '../services/update-blog-service';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostForBlogCommand } from '../services/create-post-for-blog-service';
import { CreateBlogCommand } from '../services/create-blog-service';
import { AuthGuard } from '../../../common/guard/auth-guard';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';
import { DataUserExtractorFromTokenGuard } from '../../../common/guard/data-user-extractor-from-token-guard';
import { Request } from 'express';

@Controller('blogs')
export class BlogController {
  constructor(
    /*это sqrs и service разбит на подчасти
     * и в каждой отдельный метод
     * конспект 1501*/
    protected commandBus: CommandBus,
    protected blogQueryRepository: BlogQueryRepository,
    protected postQueryRepository: PostQueryRepository,
  ) {}

  /*Nest.js автоматически возвращает следующие
  HTTP-статус коды по умолчанию:
  post 201,get 200, delete 200, put 200
  ....
  а ошибки по умолчанию
  post 400,get 404, delete 404, put 400*/

  @UseGuards(AuthGuard)
  /*@HttpCode(HttpStatus.CREATED) необязательно
   * ибо метод пост поумолчанию HTTP-статус 201 */
  @Post()
  async createBlog(
    @Body() createBlogInputModel: CreateBlogInputModel,
  ): Promise<ViewBlog> {
    const id = await this.commandBus.execute(
      new CreateBlogCommand(createBlogInputModel),
    );

    const blog = await this.blogQueryRepository.getBlogById(id);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException('blog not found:andpoint-post,url /blogs');
    }
  }

  @Get()
  async getBlogs(@Query() queryParamsBlogInputModel: QueryParamsInputModel) {
    const blogs = await this.blogQueryRepository.getBlogs(
      queryParamsBlogInputModel,
    );

    return blogs;
  }

  @Get(':id')
  async getBlogById(@Param('id') bologId: string) {
    const blog = await this.blogQueryRepository.getBlogById(bologId);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException('blog not found:andpoint-get,url /blogs/id');
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlogById(@Param('id') blogId: string) {
    const isDeleteBlogById: boolean | null = await this.commandBus.execute(
      new DeleteBlogByIdCommand(blogId),
    );

    if (isDeleteBlogById) {
      return;
    } else {
      throw new NotFoundException(
        'blog not found:andpoint-delete,url /blogs/id',
      );
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlog(
    @Param('id') bologId: string,
    @Body() updateBlogInputModel: CreateBlogInputModel,
  ) {
    const isUpdateBlog = await this.commandBus.execute(
      new UpdateBlogCommand(bologId, updateBlogInputModel),
    );

    if (isUpdateBlog) {
      return;
    } else {
      throw new NotFoundException(
        'blog not update:andpoint-put ,url /blogs/id',
      );
    }
  }

  @UseGuards(AuthGuard, DataUserExtractorFromTokenGuard)
  @Post(':blogId/posts')
  async createPostFortBlog(
    @Param('blogId') blogId: string,
    @Body() createPostForBlogInputModel: CreatePostForBlogInputModel,
    @Req() request: Request,
  ): Promise<PostWithLikesInfo | null> {
    /* чтобы переиспользовать в этом обработчике метод
 getPostById  ему нужна (userId)- она будет 
 в данном случае null но главное что удовлетворяю
 метод значением-userId*/

    const userId: string | null = request['userId'];

    /* создать новый пост ДЛЯ КОНКРЕТНОГО БЛОГА и вернут
     данные этого поста и также структуру 
    данных(снулевыми значениями)  о лайках к этому посту*/

    const postId: string | null = await this.commandBus.execute(
      new CreatePostForBlogCommand(blogId, createPostForBlogInputModel),
    );

    if (!postId) {
      throw new NotFoundException(
        'Not found blog- ' + ':method-post,url -blogs/:blogId /post',
      );
    }

    const post: PostWithLikesInfo | null =
      await this.postQueryRepository.getPostById(userId, postId);

    if (post) {
      return post;
    } else {
      throw new NotFoundException(
        'Not create post- ' + ':method-post,url -blogs/:blogId /post',
      );
    }
  }

  @UseGuards(DataUserExtractorFromTokenGuard)
  @Get(':blogId/posts')
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() queryParamsPostForBlogInputModel: QueryParamsInputModel,
    @Req() request: Request,
  ): Promise<ViewModelWithArrayPosts> {
    /*Айдишка пользователя нужна для-- когда
    отдадим ответ в нем дудет информация 
    о том какой статус учтановил данный пользователь
    который этот запрос делает */

    const userId: string | null = request['userId'];

    //вернуть все posts(массив) для корректного блога
    //и у каждого поста  будут данные о лайках

    const posts = await this.postQueryRepository.getPostsByCorrectBlogId(
      userId,
      blogId,
      queryParamsPostForBlogInputModel,
    );

    if (posts) {
      return posts;
    } else {
      throw new NotFoundException(
        'blog  is not exists  ' + ':method-get,url -blogs/:blogId /posts',
      );
    }
  }
}
