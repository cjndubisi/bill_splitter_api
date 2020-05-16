import request from 'supertest';
import app from '../../server';
import db from './../../db';
import { createGroup } from '../../models/group';
beforeAll(async () => {
  await db.sequelize.sync();
});
afterAll(async () => {
  await db.sequelize.query('DROP TABLE groups; DROP TABLE users;');
});
describe('Group Route', () => {
  it('can create new a group', async () => {
    const res = await request(app)
      .post('/v1/groups')
      .send({ name: 'group1_test' });

    expect(res.body.name).toEqual('group1_test');
  });

  it('can fetch a group by name', async () => {
    const createdRes = await request(app)
      .post('/v1/groups')
      .send({ name: 'group_test_1' });
    const res = await request(app).get(`/v1/groups/${createdRes.body.id}`);

    expect(createdRes.body.id).toEqual(res.body.id);
  });
});
