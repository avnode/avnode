const assert = require('assert');
const mongoose = require('mongoose');
const slug = require('../../lib/utilities/slug');

let Event;
try {
  Event = mongoose.model('Event');
} catch (e) {
  Event = require('../../lib/models/Event');
}

describe('Event', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('should have a valid virtual property editUrl', (done) => {
    const event = new Event({
      title: 'Foo Bar',
      slug: slug.parse('Foo Bar')
    });
    assert.equal(
      process.env.BASE + 'account/events/foo-bar',
      event.editUrl
    );
    done();
  });
  it('should have a valid virtual property publicUrl', (done) => {
    const event = new Event({
      title: 'Foo Bar',
      slug: slug.parse('Foo Bar')
    });
    assert.equal(
      process.env.BASE + 'events/foo-bar',
      event.publicUrl
    );
    done();
  });
});
