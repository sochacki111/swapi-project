import request from 'supertest';
import app from '../../../app';

it('returns 200 on successful signin', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  return request(app)
    .post('/api/auth/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);
});

it('throws an error when invalid data', async () => {
  return request(app)
    .post('/api/auth/signin')
    .send({ email: 'invalid@email.com' })
    .expect(400);
});

it('throws an error when no user in the database', async () => {
  return request(app)
    .post('/api/auth/signin')
    .send({ email: 'ts@ts.com', password: 'pass' })
    .expect(400);
});
