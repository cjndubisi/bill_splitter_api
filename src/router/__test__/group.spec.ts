import request from 'supertest';
import app from '../../server';
import db from './../../db';

beforeAll(async () => {
  await db.sequelize.sync();
});
afterAll(async () => {
  await db.sequelize.query('DROP TABLE groups; DROP TABLE users;');
});
describe('Group Route', () => {
  let createdRes: any = null;
  beforeEach(async () => {
    createdRes = await request(app)
      .post('/v1/groups')
      .send({ name: 'group_test_1' });
  });
  
  it('can create new a group', async () => {
    const res = await request(app)
      .post('/v1/groups')
      .send({ name: 'group1_test' });

    expect(res.body.name).toEqual('group1_test');
  });

  it('can update a group name', async () => {
    const res = await request(app)
      .put(`/v1/groups/${createdRes.body.id}`)
      .send({ name: 'group2' })
      .expect(200);

    expect(res.body.name).toEqual('group2');
  });

  it('can fetch a group by id', async () => {
    const res = await request(app)
      .get(`/v1/groups/${createdRes.body.id}`)
      .expect(200);
    expect(createdRes.body.id).toEqual(res.body.id);
  });

  it('can delete a group', async () => {
    const res = await request(app)
      .delete(`/v1/groups/${createdRes.body.id}`)
      .expect(200);
    expect(res.status).toEqual(200);
  });
});
