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
  it('can create account', async () => {
    const res = await request(app)
      .post('/v1/users/signup')
      .send({ email: 'fasdf', password: 'fsdfs', name: 'safa' });

    expect(res.body.message).not.toBeNull();
    expect(res.body.message).toBe('Succesfully logged');
  });
});
