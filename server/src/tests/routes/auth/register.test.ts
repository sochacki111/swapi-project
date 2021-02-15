import request from 'supertest';
import app from '../../../app';

it('returns 201 on successful signup', async () => {
  return request(app)
    .post('/api/auth/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
});

it('throws an error when invalid data', async () => {
  return request(app)
    .post('/api/auth/register')
    .send({ email: 'invalid@email.com' })
    .expect(400);
});
