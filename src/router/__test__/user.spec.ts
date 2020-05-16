import request from 'supertest';
import app from '../../server';
import db from './../../db';
beforeAll(async () => {
  await db.sequelize.sync();
});

afterAll(async () => {
  await db.sequelize.query('DROP TABLE groups; DROP TABLE users;');
});

describe('User Route', () => {
  describe('sign up', () => {
    it('fails on invalid param', async () => {
      const res = await request(app)
        .post('/v1/users/signup')
        .send({ email: 'fasdf', password: 'fsdfs' });
      console.log(res.body, res.status);

      expect(res.body.message).toBe('Bad Request');
    });

    it('can create account', async () => {
      const res = await request(app)
        .post('/v1/users/signup')
        .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });

      expect(res.body.message).toBe('Signup Successful');
    });
  });

  describe('login', () => {
    it('can login', async () => {
      await request(app)
        .post('/v1/users/signup')
        .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });
      const res = await request(app)
        .post('/v1/users/login')
        .send({ email: 'fasdf', password: 'fsdfss' });
      expect(res.body.user).not.toBeNull();
      expect(res.body.token).not.toBeNull();
      expect(res.body.message).not.toBeNull();
    });
  });
});
