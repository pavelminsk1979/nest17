import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domains/domain-post';
import {
  ExtendedLikesInfo,
  NewestLikes,
  PostWithLikesInfo,
} from '../api/types/views';
import { QueryParamsInputModel } from '../../../common/pipes/query-params-input-model';
import { LikeStatusForPostRepository } from '../../like-status-for-post/repositories/like-status-for-post-repository';
import { LikeStatusForPostDocument } from '../../like-status-for-post/domain/domain-like-status-for-post';
import { LikeStatus } from '../../../common/types';
import { BlogRepository } from '../../blogs/repositories/blog-repository';

@Injectable()
/*@Injectable()-декоратор что данный клас
 инжектируемый--тобишь в него добавляются
 зависимости
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * providers: [AppService,UsersService]
 провайдер-это в том числе компонент котоый
 возможно внедрить как зависимость*/
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected likeStatusForPostRepository: LikeStatusForPostRepository,
    protected blogRepository: BlogRepository,
  ) {}

  async getPosts(
    userId: string | null,
    queryParamsPostForBlog: QueryParamsInputModel,
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } =
      queryParamsPostForBlog;

    const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

    const posts: PostDocument[] = await this.postModel
      .find({})

      .sort({ [sortBy]: sortDirectionValue })

      .skip((pageNumber - 1) * pageSize)

      .limit(pageSize)

      .exec();

    const totalCount: number = await this.postModel.countDocuments({});

    const pagesCount: number = Math.ceil(totalCount / pageSize);

    /* Если в коллекции postModel не будет постов ,
     тогда  метод find вернет пустой
 массив ([]) в переменную posts.*/

    if (posts.length === 0) {
      return {
        pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount,
        items: [],
      };
    }

    const arrayPosts: PostWithLikesInfo[] = await this.makeArrayPosts(
      userId,
      posts,
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: arrayPosts,
    };
  }

  async makeArrayPosts(userId: string | null, posts: PostDocument[]) {
    /* из posts( массив постов)
    - достану из каждого поста  _id(aйдишку поста)
    буду иметь массив айдишек */

    const arrayPostId: string[] = posts.map((e) => e._id.toString());

    /*из коллекции LikeStatusForPost
    достану все документы которые относятся
    к постам полученым (по айдишка)  плюс они будут отсортированы
    (первый самый новый)*/

    const allLikeStatusDocumentsForCurrentPosts: LikeStatusForPostDocument[] =
      await this.likeStatusForPostRepository.findAllDocumentsByArrayPostId(
        arrayPostId,
      );

    /* создаю массив постов с информацией о лайках 
    (он пойдет на фронтенд) 
    мапом прохожу и для каждого поста 
    делаю операции для получения обьекта   тип- PostWithLikesInfo */

    /* ЗДЕСЬ return  возвращает наружу  результат 
     работы метода map*/
    return posts.map((post: PostDocument) => {
      /* отдельный метод (createAlonePostWithLikeInfo) который создае 
       один пост со всеми вложеностями
       -с информацией о лайках*/

      const postWithLikeInfo = this.createAlonePostWithLikeInfo(
        userId,
        post,
        allLikeStatusDocumentsForCurrentPosts,
      );

      /*один обьект (postWithLikeInfo) методе map  создан и ретурном
       помещен в  результатирующий массив*/
      return postWithLikeInfo;
    });
  }

  createAlonePostWithLikeInfo(
    userId: string | null,
    /* userId чтоб определить статус того 
   пользователя который данный запрос делает */

    post: PostDocument,
    allLikeStatusDocumentsForCurrentPosts: LikeStatusForPostDocument[],
  ) {
    /*для одного поста нахожу все документы
    из массива ЛАЙКОВ */

    const allLikeStatusDocumentsForCurrentPost: LikeStatusForPostDocument[] =
      allLikeStatusDocumentsForCurrentPosts.filter(
        (e) => e.postId === post._id.toString(),
      );

    /* получаю  массив документов с Like*/

    const like: LikeStatusForPostDocument[] =
      allLikeStatusDocumentsForCurrentPost.filter(
        (e) => e.likeStatus === LikeStatus.LIKE,
      );

    /* получаю  массив документов с DisLike*/

    const dislike: LikeStatusForPostDocument[] =
      allLikeStatusDocumentsForCurrentPost.filter(
        (e) => e.likeStatus === LikeStatus.DISLIKE,
      );

    /* получаю из массива со статусом Like
    три документа  новейших по дате
    --сортировку я произвел когда все документы
     ЛАЙКСТАТУСДЛЯПОСТОВ из   базыданных доставал */

    const threeDocumentWithLike: LikeStatusForPostDocument[] = like.slice(0, 3);

    /*  надо узнать какой статус поставил пользователь данному посту, 
      тот пользователь который данный запрос делает - его айдишка
       имеется */

    let likeStatusCurrentPostCurrentUser: LikeStatus;

    const result = allLikeStatusDocumentsForCurrentPost.find(
      (e) => e.userId === userId,
    );

    if (!result) {
      likeStatusCurrentPostCurrentUser = LikeStatus.NONE;
    } else {
      likeStatusCurrentPostCurrentUser = result.likeStatus;
    }

    /*  
      ---post: PostDocument- нахожусь внутри метода map
      и post - это текущий документ 
      ----like/dislike: LikeStatusForPostDocument[] массивы - 
      длинны их использую 
      ---likeStatusCurrentPostCurrentUser: LikeStatus - статус 
      пользователя который текущий запрос делает 
      ---threeDocumentWithLike: LikeStatusForPostDocument[]
      три документа - это самые последние(новые) которые
      ЛАЙК этому посту поставили 
     */

    const threeLatestLike: NewestLikes[] = threeDocumentWithLike.map(
      (el: LikeStatusForPostDocument) => {
        return {
          userId: el.userId,
          addedAt: el.addedAt,
          login: el.login,
        };
      },
    );

    const extendedLikesInfo: ExtendedLikesInfo = {
      likesCount: like.length,
      dislikesCount: dislike.length,
      myStatus: likeStatusCurrentPostCurrentUser,
      newestLikes: threeLatestLike,
    };

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo,
    };
  }

  async getPostsByCorrectBlogId(
    userId: string | null,
    blogId: string,
    queryParams: QueryParamsInputModel,
  ) {
    ///надо проверить существует ли такой blog

    const blog = await this.blogRepository.findBlog(blogId);

    if (!blog) return null;

    const { sortBy, sortDirection, pageNumber, pageSize } = queryParams;

    const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

    const filter = { blogId };

    const posts: PostDocument[] = await this.postModel
      .find(filter)

      .sort({ [sortBy]: sortDirectionValue })

      .skip((pageNumber - 1) * pageSize)

      .limit(pageSize)

      .exec();

    const totalCount: number = await this.postModel.countDocuments(filter);

    const pagesCount: number = Math.ceil(totalCount / pageSize);

    /* Если в коллекции postModel не будет документов,
       c указаным  blogId , то метод find вернет пустой
     массив ([]) в переменную posts.*/

    if (posts.length === 0) {
      return {
        pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount,
        items: [],
      };
    }

    const arrayPosts: PostWithLikesInfo[] = await this.makeArrayPosts(
      userId,
      posts,
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: arrayPosts,
    };
  }

  async getPostById(userId: string | null, postId: string) {
    const post: PostDocument | null = await this.postModel.findById(postId);

    if (!post) return null;

    /* найду все документы LikeStatus для текущего поста
     * если ничего не найдет то вернет пустой массив*/

    const allDocumentsLikeStatus: LikeStatusForPostDocument[] =
      await this.likeStatusForPostRepository.findAllDocumentByPostId(postId);

    const postWithLikeInfo = this.createAlonePostWithLikeInfo(
      userId,
      post,
      allDocumentsLikeStatus,
    );

    return postWithLikeInfo;
  }

  /*  ЭТОТ МЕТОД ДЛЯ СОЗДАНИЯ ВИДА !!! НОВОГО ПОСТА !!!
   * отличатся будет потомучто у нового поста еще не будет
   * лайков и поэтому значения лайков будут нулевые
   * вобще нет запросов за лайками в базу данных
   * */
  /*  createViewModelNewPost(post: PostDocument): PostWithLikesInfo {
      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatus.NONE,
          newestLikes: [
            {
              addedAt: '',
              userId: '',
              login: '',
            },
          ],
        },
      };
    }*/
}

/*

async getPostById(postId: string) {
  const post: PostDocument | null = await this.postModel.findById(postId);

  if (post) {
    return this.createViewModelNewPost(post);
  } else {
    return null;
  }
}

/!*  ЭТОТ МЕТОД ДЛЯ СОЗДАНИЯ ВИДА !!! НОВОГО ПОСТА !!!
 * отличатся будет потомучто у нового поста еще не будет
 * лайков и поэтому значения лайков будут нулевые
 * вобще нет запросов за лайками в базу данных
 * *!/
createViewModelNewPost(post: PostDocument): PostWithLikesInfo {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.NONE,
      newestLikes: [
        {
          addedAt: '',
          userId: '',
          login: '',
        },
      ],
    },
  };
}*/
