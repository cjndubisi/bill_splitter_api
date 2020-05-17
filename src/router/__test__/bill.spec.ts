import request from 'supertest';
import app from '../../server';
import db from '../../db';
import faker from 'faker';
import User, { createUser, UserAttributes } from '../../models/user';
import Group from '../../models/group';
let userToken = '';
let user: any = null;
let createdGroup: any = null;

beforeAll(async () => {
  await db.sequelize.sync();
  let info = {
    email: faker.internet.email(),
    password: 'random',
  };
  // create user
  user = (await createUser({
    name: faker.name.firstName(),
    ...info,
  })) as User & UserAttributes;
  const { body } = await request(app).post('/v1/users/login').send(info);
  // create goop
  createdGroup = await user.createGroup({ name: 'ranking' });

  user = body.user;
  userToken = body.token;
});

afterAll(() => {
  return db.sequelize.query('TRUNCATE usergroups, bill_particiants, bills, groups, users CASCADE;');
});

describe('Bill Route', () => {
  it('Bill route', async () => {
    // add user 2 to groups
    const { body: group } = await request(app)
      .post(`/v1/groups/${createdGroup.id}/users`)
      .set('Authorization', `bearer ${userToken}`)
      .send({
        name: faker.name.firstName(),
        email: faker.internet.email(),
      });

    const participants = group.users?.map((a: any) => a.id);
    // add new bill
    const { body } = await request(app)
      .post('/v1/bills')
      .set('Authorization', `bearer ${userToken}`)
      .send({
        name: 'electricity',
        amount: 40,
        payerId: user.id,
        participants: participants,
        groupId: createdGroup.id,
      })
      .expect(201);

    expect(body.groupId).toEqual(createdGroup.id);
    expect(body.participants.length).toEqual(2);
  });
});
