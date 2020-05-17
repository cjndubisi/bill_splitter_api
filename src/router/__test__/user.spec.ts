import request from 'supertest';
import app from '../../server';
import db from '../../db';
import faker from 'faker';
import Group, { createGroup } from '../../models/group';
let created: any = null;
beforeAll(async () => {
  const res = await request(app)
    .post('/v1/users/signup')
    .send({ email: faker.internet.email(), password: 'fsdfs', name: 'safa' });
  created = res.body;
  return await db.sequelize.sync();
});

afterAll(async () => {
  await db.sequelize.query('TRUNCATE usergroups, groups, users;');
});

describe('User Route', () => {
  describe('sign up', () => {
    it('fails on invalid param', async () => {
      const res = await request(app)
        .post('/v1/users/signup')
        .send({ email: faker.internet.email(), password: 'fsdfs' });

      expect(res.body.message).toBe('Bad Request');
    });

    it('can create account', async () => {
      expect(created.message).toBe('Signup Successful');
    });
  });

  describe('login', () => {
    it('can login', async () => {
      const res = await request(app)
        .post('/v1/users/login')
        .send({ email: faker.internet.email(), password: 'fsdfss' });
      expect(res.body.user).not.toBeNull();
      expect(res.body.token).not.toBeNull();
      expect(res.body.message).not.toBeNull();
    });
  });
});
