  import { Test } from '@nestjs/testing';
  import { INestApplication } from '@nestjs/common';
  import request from 'supertest';

  import { AppModule } from '../src/app.module';

  describe('Posts E2E', () => {
    let app: INestApplication;
    let accessToken: string;
    let refreshToken: string;
    let userId: number;
    let postId: number;

    beforeAll(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

      //register
      const email = `postuser${Date.now()}@mail.com`;
      const password = '123123123';

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .then((res) => {
        userId = res.body.id;
      });

      //login
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password });

      accessToken = loginRes.body.accessToken;
      refreshToken = loginRes.body.refreshToken;
    });

    afterAll(async () => {
      await app.close();
    });

    //cannot access without token
    it('cannot access posts without token', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ title: 'Fail', content: 'Fail' })
      .expect(401);
    });

    //create post with token
    it('create post with token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Hello', content: 'World' })
      .expect(201);

      expect(res.body.id).toBeDefined();
      postId = res.body.id;
    });

    //refresh token
    it('refresh token works', async () => {
    const refreshRes = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(201);

      expect(refreshRes.body.accessToken).toBeDefined();
      expect(refreshRes.body.refreshToken).toBeDefined();

      accessToken = refreshRes.body.accessToken;
    });

    //get all post with access refresh token
    it('access with refreshed token', async () => {
    await request(app.getHttpServer())
      .get('/api/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    });

    //get post by id
    it('get post by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/posts/${postId}`)
      .expect(200);

      expect(res.body.id).toBe(postId);
    });

    //update post
    it('update post with token', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated title' })
      .expect(200);

      expect(res.body.title).toBe('Updated title');
    });

    //get post by user
  it('get posts by user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/users/${userId}/posts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].userId).toBe(userId);
    });

    //delete post
    it('delete post with token', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

      expect(res.body.message).toBeDefined();
    });
  });
