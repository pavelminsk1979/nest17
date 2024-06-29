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

/*   1--  этот тест чтобы создать проверку 
  автоматического  теста  */

describe('tests for andpoint posts/:postId/comments', () => {
  let app;

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

  let blogId;

  let postId;

  let userModel: Model<UserDocument>;

  const login1 = 'login1';

  const password1 = 'password1';

  const ema1 = 'ema1@mail.ru';

  let code1;

  let accessToken1;

  const login2 = 'login2';

  const password2 = 'password2';

  const ema2 = 'ema2@mail.ru';

  let code2;

  let accessToken2;

  const login3 = 'login3';

  const password3 = 'password3';

  const ema3 = 'ema3@mail.ru';

  let code3;

  let accessToken3;

  const login4 = 'login4';

  const password4 = 'password4';

  const ema4 = 'ema4@mail.ru';

  let code4;

  let accessToken4;

  let commentId1;

  let commentId2;

  let commentId3;

  let commentId4;

  let commentId5;

  let commentId6;

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

  it('registration 1 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: login1,
        password: password1,
        email: ema1,
      })
      .expect(204);
    const user = await userModel.find();
    //expect(user).not.toBeNull();
    //console.log(user[0]);
    code1 = user[0].confirmationCode;
  });

  it('registration-confirmation 1 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code: code1 })
      .expect(204);
  });

  it(' login 1 user ', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login1,
        password: password1,
      })
      .expect(200);

    //console.log(res.body);
    accessToken1 = res.body.accessToken;
  });

  it('registration 2 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: login2,
        password: password2,
        email: ema2,
      })
      .expect(204);
    const user = await userModel.find();
    //expect(user).not.toBeNull();
    //console.log(user);
    code2 = user[1].confirmationCode;
  });

  it('registration-confirmation 2 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code: code2 })
      .expect(204);
  });

  it(' login 2 user ', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login2,
        password: password2,
      })
      .expect(200);

    //console.log(res.body);
    accessToken2 = res.body.accessToken;
  });

  it('registration 3 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: login3,
        password: password3,
        email: ema3,
      })
      .expect(204);
    const user = await userModel.find();
    //expect(user).not.toBeNull();
    //console.log(user);
    code3 = user[2].confirmationCode;
  });

  it('registration-confirmation3 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code: code3 })
      .expect(204);
  });

  it(' login 3 user ', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login3,
        password: password3,
      })
      .expect(200);

    //console.log(res.body);
    accessToken3 = res.body.accessToken;
  });

  it('registration 4 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: login4,
        password: password4,
        email: ema4,
      })
      .expect(204);
    const user = await userModel.find();
    //expect(user).not.toBeNull();
    //console.log(user[0]);
    code4 = user[3].confirmationCode;
  });

  it('registration-confirmation4 user', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({ code: code4 })
      .expect(204);
  });

  it(' login 1 user ', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login4,
        password: password4,
      })
      .expect(200);

    //console.log(res.body);
    accessToken4 = res.body.accessToken;
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

  it('create 1  commit for  post ', async () => {
    const res = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        content: 'contentForPost contentForPost contentForPost',
      })
      .expect(201);

    //console.log(res.body);
    commentId1 = res.body.id;
  });

  it('create 2  commit for  post ', async () => {
    const res = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        content: '2content contentForPost contentForPost',
      })
      .expect(201);

    //console.log(res.body);
    commentId2 = res.body.id;
  });

  it('create 3  commit for  post ', async () => {
    const res = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        content: '3content contentForPost contentForPost',
      })
      .expect(201);

    //console.log(res.body);
    commentId3 = res.body.id;
  });

  it('create 4  commit for  post ', async () => {
    const res = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        content: '4content contentForPost contentForPost',
      })
      .expect(201);

    //console.log(res.body);
    commentId4 = res.body.id;
  });

  it('create 5  commit for  post ', async () => {
    const res = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        content: '5content contentForPost contentForPost',
      })
      .expect(201);

    //console.log(res.body);
    commentId5 = res.body.id;
  });

  it('create 6  commit for  post ', async () => {
    const res = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        content: '6content contentForPost contentForPost',
      })
      .expect(201);

    //console.log(res.body);
    commentId6 = res.body.id;
  });

  it('create likeStatus for correct comment ', async () => {
    await request(app.getHttpServer())
      .put(`/comments/${commentId1}/like-status`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);
  });

  /*  it('get  commit  ', async () => {
      const res = await request(app.getHttpServer())
        .get(`/comments/${commentId1}`)
  
        .expect(200);
  
      console.log(res.body);
    });*/

  it('get  commit  ', async () => {
    //console.log(accessToken);
    //console.log(postId);
    const res = await request(app.getHttpServer())
      .get(`/posts/${postId}/comments`)

      .expect(200);

    //console.log(res.body.items);
    //console.log(res.body);
  });
});
