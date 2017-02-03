const server = require('../../index');
const request = require('supertest');
const mongoose = require('mongoose');


describe('/', () => {
  before((done) => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    server.listen().close();
    done();
  });
  after((done) => {
    server.listen().close();
    done();
  });
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

  xit('GET to unknown route returns 404', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
