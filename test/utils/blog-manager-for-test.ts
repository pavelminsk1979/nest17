import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class BlogManagerForTest {
  constructor(protected readonly app: INestApplication) {}

  async createBlog(name: string, description: string, websiteUrl: string) {
    const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

    const blog = await request(this.app.getHttpServer())
      .post('/blogs')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        name,
        description,
        websiteUrl,
      })
      .expect(201);

    return blog;
  }
}
