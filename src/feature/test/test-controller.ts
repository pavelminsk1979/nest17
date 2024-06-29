import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts/domains/domain-post';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blogs/domains/domain-blog';
import { User, UserDocument } from '../users/domains/domain-user';
import { Comment, CommentDocument } from '../comments/domaims/domain-comment';
import {
  LikeStatusForComment,
  LikeStatusForCommentDocument,
} from '../like-status-for-comment/domain/domain-like-status-for-comment';
import {
  SecurityDevice,
  SecurityDeviceDocument,
} from '../security-device/domains/domain-security-device';

@Controller('testing')
export class TestController {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(LikeStatusForComment.name)
    private LikeStatusForCommentModel: Model<LikeStatusForCommentDocument>,
    @InjectModel(SecurityDevice.name)
    private securityDeviceModel: Model<SecurityDeviceDocument>,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all-data')
  async deleteAllData() {
    await this.postModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.LikeStatusForCommentModel.deleteMany({});
    await this.LikeStatusForCommentModel.deleteMany({});
    await this.securityDeviceModel.deleteMany({});
    return;
  }
}
