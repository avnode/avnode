const assert = require('assert');
const User = require('../../lib/models/User');
const slug = require('../../lib/utilities/slug');

describe('User', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('should have a valid virtual property publicUrl', (done) => {
    const user = new User({
      name: 'John Doe',
      stagename: 'John Doe',
      slug: slug.parse('John Doe'),
      email: 'john@doe.com'
    });
    assert.equal(
      process.env.BASE + 'performers/john-doe',
      user.publicUrl
    );
    done();
  });
});
