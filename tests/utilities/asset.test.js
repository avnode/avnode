const assert = require('assert');
const util = require('../../lib/utilities/asset');

describe('Asset Utitility', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('isYoutube should return true on valid youtube link', () => {
    const url = 'https://www.youtube.com/watch?v=OaRBPXLgKyg';
    assert.equal(
      true,
      util.isYoutube(url)
    );
  });
  it('isYoutube should return true on valid youtu.be link', () => {
    const url = 'https://youtu.be/OaRBPXLgKyg';
    assert.equal(
      true,
      util.isYoutube(url)
    );
  });
  it('isYoutube should return true on missing proctocol', () => {
    const url = 'https://youtu.be/OaRBPXLgKyg';
    assert.equal(
      true,
      util.isYoutube(url)
    );
  });
  it('isYoutube should return false on missing slug', () => {
    const url = 'https://youtu.be/';
    assert.equal(
      false,
      util.isYoutube(url)
    );
  });
  it('isYoutube should return false on invalid url', () => {
    const url = 'https://vimeo.com/207528129';
    assert.equal(
      false,
      util.isYoutube(url)
    );
  });

  it('isYoutube should return false on invalid url', () => {
    const url = 'https://vimeo.com/207528129';
    assert.equal(
      false,
      util.isYoutube(url)
    );
  });

  it('isVimeo should return true on valid url', () => {
    const url = 'https://vimeo.com/207528129';
    assert.equal(
      true,
      util.isVimeo(url)
    );
  });

  it('isVimeo should return true on valid url with missing protocol', () => {
    const url = 'vimeo.com/207528129';
    assert.equal(
      true,
      util.isVimeo(url)
    );
  });

  it('isVimeo should return false on missing slug', () => {
    const url = 'https://vimeo.com/';
    assert.equal(
      false,
      util.isVimeo(url)
    );
  });

  it('isVimeo should return false on invalid url', () => {
    const url = 'youtu.be/OaRBPXLgKyg';
    assert.equal(
      false,
      util.isVimeo(url)
    );
  });

  it('getVideoType should return youtube for youtube link', () => {
    const url = 'youtu.be/OaRBPXLgKyg';
    assert.equal(
      'youtube',
      util.getVideoType(url)
    );
  });

  it('getVideoType should return vimeo for vimeo link', () => {
    const url = 'vimeo.com/207528129';
    assert.equal(
      'vimeo',
      util.getVideoType(url)
    );
  });

  it('getVideoType should return unknown for unknown video link', () => {
    const url = 'some-unknonw-hoster.com/207528129';
    assert.equal(
      'unknown',
      util.getVideoType(url)
    );
  });

  it('setIdentifier should prepend stagename following by random uuid', () => {
    const user = {
      stagename: 'el-majestro'
    };

    const identifier = util.setIdentifier(user);
    const regex = /^\/storage\/el-majestro_.{8}-.{4}-.{4}-.{4}-.{12}/;

    assert.equal(
      true,
      regex.test(identifier)
    );
  });
});
