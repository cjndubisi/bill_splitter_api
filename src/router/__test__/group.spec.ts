import { default as supertest } from 'supertest';
import app from '../../server';
import db from '../../db';
import {} from '../../models/group';
import faker from 'faker';
import User from '../../models/user';
let userToken = '';
let createdGroup: any = null;

beforeAll(async () => {
  await db.sequelize.sync();
  const res = await supertest(app).post('/v1/users/signup').send({
    email: faker.internet.email().toLowerCase(),
    password: 'fsdfs',
    name: 'safa',
  });
  userToken = res.body.token;

  createdGroup = await supertest(app)
    .post('/v1/groups')
    .set('Authorization', `bearer ${userToken}`)
    .send({ name: 'group_test_1' });
});

afterAll(() => {
  return db.sequelize.query(
    'TRUNCATE usergroups, bill_particiants, bills, groups, users CASCADE;'
  );
});

describe('Group Route', () => {
  it('can create new a group', async () => {
    expect(createdGroup.body.name).toEqual('group_test_1');
  });

  it('can update a group name', async () => {
    const res = await supertest(app)
      .put(`/v1/groups/${createdGroup.body.id}`)
      .set('Authorization', `bearer ${userToken}`)
      .send({ name: 'group2' })
      .expect(200);

    expect(res.body.name).toEqual('group2');
  });

  it('can fetch a group by id', async () => {
    const res = await supertest(app)
      .get(`/v1/groups/${createdGroup.body.id}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(200);

    expect(createdGroup.body.id).toEqual(res.body.id);
  });

  it('can delete a group', async () => {
    const toBeDeleted = await supertest(app)
      .post('/v1/groups')
      .set('Authorization', `bearer ${userToken}`)
      .send({ name: faker.internet.email() })
      .expect(201);
    const res = await supertest(app)
      .delete(`/v1/groups/${toBeDeleted.body.id}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(200);

    expect(res.status).toEqual(200);
  });

  it("can fetch signed in user's groups ", async () => {
    const res = await supertest(app)
      .get(`/v1/groups`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(200);
    expect(res.body.length).toEqual(1);
    expect(res.status).toEqual(200);
  });

  it('user can have more than one group', async () => {
    await supertest(app)
      .post('/v1/groups')
      .set('Authorization', `bearer ${userToken}`)
      .send({ name: 'group_test_2' })
      .expect(201);

    const res = await supertest(app)
      .get(`/v1/groups`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(200);
    expect(res.body.length).toEqual(2);
    expect(res.status).toEqual(200);
  });

  it('can add users to group', async () => {
    const res = await supertest(app)
      .post(`/v1/groups/${createdGroup.body.id}/users`)
      .set('Authorization', `bearer ${userToken}`)
      .send({ name: 'user_2', email: faker.internet.email().toLowerCase() })
      .expect(201);

    expect(res.body.users.length).toEqual(2);
  });
});
