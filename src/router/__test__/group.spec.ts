import request from 'supertest';
import app from '../../server';
import db from './../../db';
beforeAll(async () => {
  await db.sequelize.sync();
});
describe('Group Route', () => {
  it('can create new a group', async () => {
    const res = await request(app)
      .post('/v1/groups')
      .send({ name: 'group1_test' });

    expect(res.body.name).toEqual('group1_test');
  });
});
