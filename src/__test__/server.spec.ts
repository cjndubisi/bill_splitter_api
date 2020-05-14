import request from 'supertest';
import app from '../server';

describe('sever', () => {
  it('can access /v1', async () => {
    const res = await request(app).get('/v1');
    expect(res.body.message).not.toBeNull();
    expect(res.body.message).toBe('Root Page');
  });

  it('return bad request for invalid routes', async () => {
    const res = await request(app).get('/random');
    expect(res.body.message).toBe('Bad Request');
    expect(res.status).toEqual(400);
  });
});
