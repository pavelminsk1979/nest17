import { Injectable } from '@nestjs/common';
import { BlogDocument } from '../../blogs/domains/domain-blog';
import { BlogRepository } from '../../blogs/repositories/blog-repository';
import { Post, PostDocument } from '../domains/domain-post';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostRepository } from '../repositories/post-repository';
import { CreatePostInputModel } from '../api/pipes/create-post-input-model';
import { UpdatePostInputModel } from '../api/pipes/update-post-input-model';
import { LikeStatus } from '../../../common/types';
import { LikeStatusForPostRepository } from '../../like-status-for-post/repositories/like-status-for-post-repository';
import {
  LikeStatusForPost,
  LikeStatusForPostDocument,
} from '../../like-status-for-post/domain/domain-like-status-for-post';
import { UsersRepository } from '../../users/repositories/user-repository';

@Injectable()
/*@Injectable()-декоратор что данный клас
 инжектируемый--тобишь в него добавляются
 зависимости
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * providers: [AppService,UsersService]
 провайдер-это в том числе компонент котоый
 возможно внедрить как зависимость*/
export class PostService {
  constructor(
    protected blogRepository: BlogRepository,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected postRepository: PostRepository,
    protected likeStatusForPostRepository: LikeStatusForPostRepository,
    @InjectModel(LikeStatusForPost.name)
    protected likeStatusModelForPost: Model<LikeStatusForPostDocument>,
    protected usersRepository: UsersRepository,
  ) {}

  async createPost(createPostInputModel: CreatePostInputModel) {
    const { content, shortDescription, title, blogId } = createPostInputModel;

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

  async updatePost(
    postId: string,
    updatePostInputModel: UpdatePostInputModel,
  ): Promise<boolean> {
    return this.postRepository.updatePost(postId, updatePostInputModel);
  }

  async deletePostById(postId: string) {
    return this.postRepository.deletePostById(postId);
  }

  async setLikestatusForPost(
    userId: string,
    postId: string,
    likeStatus: LikeStatus,
  ) {
    const userDocument = await this.usersRepository.getUserById(userId);
    /*для создания нового документа(newLikeStatusForPost) потребуется
  login  создателя--- этот login потребуется вдальнейшем когда буду 
   формировать view для отдачи на фронт */

    const login = userDocument!.login;

    /* проверка- существует ли в базе такой пост*/

    const postDocument = await this.postRepository.getPostById(postId);

    if (!postDocument) return null;

    /*    ищу в базе ЛайковДляПостов  один документ   по
             двум полям userData.userId и postId---*/

    const document: LikeStatusForPostDocument | null =
      await this.likeStatusForPostRepository.findDocumentByUserIdAndPostId(
        userId,
        postId,
      );

    if (!document) {
      /*Если документа  нет тогда надо cоздать
      новый документ и добавить в базу*/

      const newLikeStatusForPost: LikeStatusForPostDocument =
        new this.likeStatusModelForPost({
          userId,
          postId,
          likeStatus,
          login,
          addedAt: new Date().toISOString(),
        });

      return await this.likeStatusForPostRepository.save(newLikeStatusForPost);
    }

    /*Если документ есть тогда надо изменить
     statusLike в нем на приходящий и установить теперещнюю дату
      установки */

    document.likeStatus = likeStatus;

    document.addedAt = new Date().toISOString();

    return await this.likeStatusForPostRepository.save(document);
  }
}
