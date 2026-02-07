import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Users E2E', () => {
  let app: INestApplication;
  let userId: number;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('create user', async () => {
    const email = `cruduser${Date.now()}@mail.com`;
    const password = '123123123';

    const res = await request(app.getHttpServer())
      .post('/api/users')
      .send({ email, password })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe(email);
    userId = res.body.id;

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);

    accessToken = loginRes.body.accessToken;
  });

  it('get all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('get user by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.id).toBe(userId);
  });

  it('update user', async () => {
    const newEmail = `updated${Date.now()}@mail.com`;

    const res = await request(app.getHttpServer())
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: newEmail })
      .expect(200);

    expect(res.body.email).toBe(newEmail);
  });

  it('delete user', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.message).toBeDefined();
  });
});
