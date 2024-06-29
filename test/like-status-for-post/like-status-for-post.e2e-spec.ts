import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import { BlogManagerForTest } from '../utils/blog-manager-for-test';
import { EmailSendService } from '../../src/common/service/email-send-service';
import { MockEmailSendService } from '../../src/common/service/mock-email-send-service';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from '../../src/feature/users/domains/domain-user';
import { getModelToken } from '@nestjs/mongoose';

/* 
тест для  СОЗДАНИЯ ЛАЙКСТАТУСА ДЛЯ ПОСТА 
 */

/*
----регистрация  // в ней напрямую обращаюсь к базе
данных чтоб получить confirmationCode

---подтверждение регистрации .. здесь вставляю confirmationCode

---залогинился  .. получаю accessToken

---создаю blog ,  создаю post для blog  // получаю postId

---- СОЗДАЮ ЛАЙКСТАТУС ДЛЯ КОРРЕКТНОГО POST
и предоставляю айдишку поста и
 accessToken так как  это защищенный андпоинт

*/

describe('tests for andpoint posts/:postId/comments', () => {
  let app;

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

  let blogId;

  let postId;

  let accessToken;

  let userModel: Model<UserDocument>;

  const loginU = 'loginUs';

  let code;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailSendService)
      .useValue(new MockEmailSendService())
      .compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();

    userModel = moduleFixture.get<Model<UserDocument>>(
      getModelToken(User.name),
    );

    //для очистки базы данных
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  afterAll(async () => {
    await app.close();
  });

  it('registration  user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: loginU,
        password: 'passwordUs',
        email: 'avelminsk1979@mail.ru',
      })
      .expect(204);
    const user = await userModel.find();
    //expect(user).not.toBeNull();
    //console.log(user[0]);
    code = user[0].confirmationCode;
  });

  it('registration-confirmation  user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code })
      .expect(204);
  });

  it(' login  user ', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: loginU,
        password: 'passwordUs',
      })
      .expect(200);

    //console.log(res.body);
    accessToken = res.body.accessToken;
  });

  it('create blog and post with this blog', async () => {
    const blogManagerForTest = new BlogManagerForTest(app);

    const blog = await blogManagerForTest.createBlog(
      'nameBlog',
      'descriptionBl',
      'https://www.outueBl.com/',
    );

    //console.log(blog.body);

    blogId = blog.body.id;

    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        title: 'titlePost',
        shortDescription: 'shortDescriptionPost',
        content: 'contentPost',
        blogId: blogId,
      })
      .expect(201);

    postId = res.body.id;

    //console.log(res.body);
  });

  it('create likeStatus for correct post ', async () => {
    const res = await request(app.getHttpServer())
      .put(`/posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'None',
      })
      .expect(204);
  });
});
