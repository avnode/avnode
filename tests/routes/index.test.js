const request = require('supertest');
const server = require('../../index');

describe('/', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  it('GET to /returns 200 and a page',  (done) => {
    request(server)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(/h1/)
      .expect(200, done);
  });

  it('GET to unknown route returns 404', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
