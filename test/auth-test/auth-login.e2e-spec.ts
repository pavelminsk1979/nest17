import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import { UserManagerForTest } from '../utils/user-manager-for-test';

describe('tests for andpoint auth/login', () => {
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

  it('creat user and login  user', async () => {
    const userManagerForTest = new UserManagerForTest(app);

    const login1 = 'login1';

    const password1 = 'password1';

    const email1 = 'email1@ema.com';

    await userManagerForTest.createUser(login1, password1, email1);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login1,
        password: password1,
      })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    /*    если я положу  refreshToken в куку -вот так
         response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
        ......это значит он в заголовках
    
        свойство res.headers['set-cookie'] содержит
        массив строк, представляющих заголовки 'Set-Cookie',
          включая куку 'refreshToken'.*/
    const allCookies = res.headers['set-cookie'];

    console.log(allCookies[0].split(';')[0]);

    console.log(res.body);
  });

  it('No login  user...incorrect loginOrEmail...pipe check', async () => {
    const userManagerForTest = new UserManagerForTest(app);

    const login2 = 'login2';

    const password2 = 'password2';

    const email2 = 'email2@ema.com';

    await userManagerForTest.createUser(login2, password2, email2);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: '',
        password: password2,
      })
      .expect(400);

    //console.log(res.body);
  });

  it('No login  user...incorrect loginOrEmail...pipe check', async () => {
    const userManagerForTest = new UserManagerForTest(app);

    const login3 = 'login3';

    const password3 = 'password3';

    const incorrect = 'passwo333';

    const email3 = 'email3@ema.com';

    await userManagerForTest.createUser(login3, password3, email3);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login3,
        password: incorrect,
      })
      .expect(401);

    //console.log(res.body);
  });
});
