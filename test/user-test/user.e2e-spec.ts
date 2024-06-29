import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';

describe('tests for andpoint users', () => {
  let app;

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

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

  let userId;

  it('create user', async () => {
    const newLogin = '123456789';

    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        login: newLogin,
        password: 'short456',
        email: 'pavel@mail.com',
      })
      .expect(201);

    userId = res.body.id;

    // console.log(res.body);

    expect(res.body.login).toEqual(newLogin);
  });

  it(' create user ERROR,because exist email in bd', async () => {
    const newLogin = '123456';

    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        login: newLogin,
        password: 'short456',
        email: 'pavel@mail.com',
      })
      .expect(400);

    //console.log(res.body);
  });

  it(' create user ERROR, because not Basic authorization', async () => {
    const newLogin = '123456';

    const res = await request(app.getHttpServer())
      .post('/users')
      .send({
        login: newLogin,
        password: 'short456',
        email: 'pavel@mail.com',
      })
      .expect(401);

    //console.log(res.body);
  });

  it('get users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)

      .expect(200);
    //console.log(res.body);
  });

  it('delete  user by id', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)

      .expect(204);
  });

  /*  ПОЛОЖИТЬ В ХРАНИЛИЩЕ
    expect.setState({
      login1: newLogin,
      userId1: res.body.id,
      loginPasswordBasic64,
    });
    
    
    ДОСТАТЬ ИЗ ХРАНИЛИЩА В ЛЮБЫХ ТЕСТАХ
    ДАННОГО describe ОКРУЖЕНИЯ 
    const { login1, loginPasswordBasic64 } = expect.getState();
    */
});
