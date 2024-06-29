import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import { UserManagerForTest } from '../utils/user-manager-for-test';
import cookieParser from 'cookie-parser';

describe('tests for andpoint auth/refresh-token', () => {
  let app;

  let refreshToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

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

    const refrToken = allCookies[0].split(';')[0];

    refreshToken = refrToken.split('=')[1];

    //console.log(res.body.accessToken);

    //console.log(refreshToken);
  });

  it('request on andpoint refresh-token and get 2 token, access and refresh ', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);

    const allCookies = res.headers['set-cookie'];

    //console.log(allCookies[0].split(';')[0]);

    //console.log(res.body.accessToken);
  });
});
