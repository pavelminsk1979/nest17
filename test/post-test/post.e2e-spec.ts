import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import { BlogManagerForTest } from '../utils/blog-manager-for-test';

describe('tests for andpoint posts', () => {
  let app;

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();

    //для очистки базы данных
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be mistake when create post', async () => {
    const blogManagerForTest = new BlogManagerForTest(app);

    const blog3 = await blogManagerForTest.createBlog(
      'name3',
      'description3',
      'https://www.outue3.com/',
    );

    expect.setState({ idBlog3: blog3.body.id });

    const { idBlog3 } = expect.getState();

    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        title: '  ',
        shortDescription: 'shortDescriptionPost',
        content: '  ',
        //blogId: idBlog3,
        blogId: '666c4526947c71d1229ed6b3',
      })
      .expect(400);
    //console.log(res.body);
  });

  it('create post', async () => {
    const { idBlog3 } = expect.getState();

    const newTitle = 'titlePost1';

    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        title: newTitle,
        shortDescription: 'shortDescriptionPost1',
        content: 'contentPost1',
        blogId: idBlog3,
      })
      .expect(201);

    //console.log(res.body);
    expect.setState({ idPost1: res.body.id });

    expect(res.body.title).toEqual(newTitle);
  });

  it('get posts ', async () => {
    const res = await request(app.getHttpServer())
      .get(`/posts`)

      .expect(200);
    //console.log(res.body);
    expect(res.body.items).toHaveLength(1);
  });

  it('get correct post by postId', async () => {
    const { idPost1 } = expect.getState();

    const res = await request(app.getHttpServer())
      .get(`/posts/${idPost1}`)

      .expect(200);
    //console.log(res.body);
    expect(res.body.id).toEqual(idPost1);
  });

  it('change  correct post ', async () => {
    const { idPost1, idBlog3 } = expect.getState();

    const newTitle = 'changeTitle';

    await request(app.getHttpServer())
      .put(`/posts/${idPost1}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        title: newTitle,
        shortDescription: 'shortDescriptionPost',
        content: 'contentPost',
        blogId: idBlog3,
      })

      .expect(204);

    const res = await request(app.getHttpServer())
      .get(`/posts/${idPost1}`)
      .expect(200);

    //console.log(res.body);
    expect(res.body.title).toEqual(newTitle);
  });

  it('create post2,and delete this post2', async () => {
    const { idBlog3 } = expect.getState();

    const titlePost2 = 'titlePost2';

    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        title: titlePost2,
        shortDescription: 'shortDescriptionPost2',
        content: 'contentPost2',
        blogId: idBlog3,
      })
      .expect(201);

    //console.log(res.body);
    const idPostForDelete = res.body.id;

    expect(res.body.title).toEqual(titlePost2);

    ////////////////////////////////////////////
    //delete
    await request(app.getHttpServer())
      .delete(`/posts/${idPostForDelete}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .expect(204);
  });

  ////////////////////////////////////////////

  ///////////////////////////////////////////////////

  /* 
 
   it('get correct post ', async () => {
     const { idPost1 } = expect.getState();
 
     const res = await request(app.getHttpServer())
       .get(`/posts/${idPost1}`)
 
       .expect(200);
     //console.log(res.body);
     expect(res.body.id).toEqual(idPost1);
   });
 

 
   it('get comments for correct post ', async () => {
     const { idPost1 } = expect.getState();
     await request(app.getHttpServer())
       .get(`/posts/${idPost1}/comments`)
 
       .expect(200);
     //console.log(res.body);
   });
 
   it('delete blog by id ', async () => {
     const { idPost1 } = expect.getState();
 
     await request(app.getHttpServer())
       .delete(`/posts/${idPost1}`)
       .set('Authorization', `Basic ${loginPasswordBasic64}`)
       .expect(204);
   });*/
});
