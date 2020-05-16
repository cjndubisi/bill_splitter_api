import request from 'supertest';
import app from '../../server';
jest.mock('sequelize');
jest.mock('../../models/user', () => {
  return {
    createUser: jest.fn().mockReturnValue({
      toJSON: () => ({ password: 'ff', email: 'sdd', name: 'lsss' }),
    }),
    findBy: jest.fn().mockReturnValue({
      toJSON: () => ({ password: 'ff', email: 'sdd', name: 'lsss' }),
      verifyPassword: () => true,
    }),
  };
});

describe('User Route', () => {
  describe('sign up', () => {
    it('fails on invalid param', async () => {
      const res = await request(app)
        .post('/v1/users/signup')
        .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });

      expect(res.body.message).not.toBeNull();
      expect(res.body.message).toBe('Signup Successful');
    });

    it('can create account', async () => {
      const res = await request(app)
        .post('/v1/users/signup')
        .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });

      expect(res.body.message).not.toBeNull();
      expect(res.body.message).toBe('Signup Successful');
    });
  });

  describe('login', () => {
    it('can login', async () => {
      const res = await request(app)
        .post('/v1/users/login')
        .send({ email: 'fasdf', password: 'fsdfs' });
      console.log(res.body, res.status);

      expect(res.body.user).not.toBeNull();
      expect(res.body.token).not.toBeNull();
      expect(res.body.message).not.toBeNull();
    });
  });
});
