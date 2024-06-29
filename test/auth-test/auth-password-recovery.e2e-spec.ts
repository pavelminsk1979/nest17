import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import { EmailSendService } from '../../src/common/service/email-send-service';
import { MockEmailSendService } from '../../src/common/service/mock-email-send-service';

describe.skip('tests for andpoint auth/password-recovery', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailSendService)
      .useValue(MockEmailSendService)

      .compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();

    //для очистки базы данных
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  afterAll(async () => {
    await app.close();
  });

  it('registration  user', async () => {
    const login1 = 'login111';

    const password1 = 'password1';

    const email1 = 'pavelminsk1979@mail.ru';

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: login1,
        password: password1,
        email: email1,
      })
      .expect(204);
    expect.setState({ email1 });
  });

  it('password-recovery ', async () => {
    const { email1 } = expect.getState();

    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: email1,
      })
      .expect(204);

    //console.log(res.body);
  });
});
