const request = require('supertest');
const app = require('../server');

describe('health endpoint', () => {
  it('retorna status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.insecure).toBe(false);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
