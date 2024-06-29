import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class UserManagerForTest {
  constructor(protected readonly app: INestApplication) {}

  async createUser(login: string, password: string, email: string) {
    const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

    const user = await request(this.app.getHttpServer())
      .post('/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        login,
        password,
        email,
      })
      .expect(201);

    return user;
  }
}
