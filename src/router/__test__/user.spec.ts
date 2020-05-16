import request from 'supertest';
import app from '../../server';

jest.mock('../../models/user', () => {
  return {
    createUser: jest.fn().mockReturnValue({
      toJSON: () => ({ password: 'ff', email: 'sdd', name: 'lsss' }),
    }),
  };
});

describe('User Route', () => {
  it('fails on invalid param', async () => {
    const res = await request(app)
      .post('/v1/users/signup')
      .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });
    console.log(res.body, res.status);
    expect(res.body.message).not.toBeNull();
    expect(res.body.message).toBe('Signup Successful');
  });

  it('can create account', async () => {
    const res = await request(app)
      .post('/v1/users/signup')
      .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });
    console.log(res.body, res.status);

    expect(res.body.message).not.toBeNull();
    expect(res.body.message).toBe('Signup Successful');
  });
});
