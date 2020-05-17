import request from 'supertest';
import app from '../../server';
import db from '../../db';
import faker from 'faker';
import Group, { createGroup } from '../../models/group';
import User from '../../models/user';
let created: any = null;
beforeAll(async () => {
  await db.sequelize.sync();
  const res = await request(app)
    .post('/v1/users/signup')
    .send({ email: faker.internet.email(), password: 'fsdfs', name: 'safa' });
  created = res.body;
});

afterAll(() => {
  return db.sequelize.query('TRUNCATE usergroups, groups, users CASCADE;');
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

  describe('invited user', () => {
    it('can signup', async () => {
      const group = await Group.create({ name: 'testing' });
      let invitedInfo = {
        name: 'invated',
        email: faker.internet.email(),
        password: 'faker.password',
      };
      const invited = await User.create({ ...invitedInfo, activated: false });
      const res = await request(app).post('/v1/users/signup').send(invitedInfo);

      expect(res.body.user.id).toBe(invited.id);
      expect(res.body.user.activated).toBe(true);
    });

    it('cannot login', async () => {
      const group = await Group.create({ name: 'testing' });
      let invitedInfo = {
        name: 'invated',
        email: faker.internet.email(),
        password: 'faker.password',
      };
      const invited = await User.create({ ...invitedInfo, activated: false });
      delete invitedInfo.name;
      const res = await request(app)
        .post('/v1/users/login')
        .send(invitedInfo)
        .expect(401);
    });
  });
});
