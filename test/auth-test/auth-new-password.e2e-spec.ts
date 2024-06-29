import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';

describe.skip('tests for andpoint auth/new-password', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /*  сначало запустить тест auth-password-recovery.e2e-spec.ts
  --- потом из базы данных взять confirmationCode  и вставить в recoveryCode*/

  it('new-password', async () => {
    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({
        newPassword: 'newPassword1',
        recoveryCode: '7a0b3d2e-5798-4dad-ae4b-e3a653c125cc',
      })
      .expect(204);

    //console.log(res.body);
  });
});
