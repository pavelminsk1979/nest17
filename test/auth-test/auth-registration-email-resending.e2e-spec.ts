import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';

describe.skip('tests for andpoint auth/registration-email-resending', () => {
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

  /*  ДЛЯ ТЕСТА  НАДО 
  -- запустить тест РЕГИСТРАЦИИ
  -- потом ВЗЯТЬ тотже емэл что и в тесте регистрации 
---для проверки в базе посмотреть
что изменились поля confirmationCode и expirationDate
*/
  it('registration-email-resending ', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-email-resending')
      .send({
        email: 'pavelminsk1979@mail.ru',
      })
      .expect(204);
  });
});
