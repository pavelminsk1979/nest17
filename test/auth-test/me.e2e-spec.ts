import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import { UserManagerForTest } from '../utils/user-manager-for-test';
import cookieParser from 'cookie-parser';

describe('tests for andpoint auth/me', () => {
  let app;

  let accessToken;

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

    const login1 = 'login123';

    const password1 = 'password123';

    const email1 = 'email123@ema.com';

    await userManagerForTest.createUser(login1, password1, email1);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login1,
        password: password1,
      })
      .expect(200);

    //console.log(res.body.accessToken);

    accessToken = res.body.accessToken;
  });

  it('me request ', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    console.log(res.body);
  });

  const accessTokenBad = 'accessTokenBad';

  it('me request ', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessTokenBad}`)
      .expect(401);

    console.log(res.body);
  });
});
