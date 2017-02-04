const router = require('./router')();
const elasticsearch = require('../plugins/elasticsearch');
const _ = require('lodash');
const logger = require('../utilities/logger');
const i18n = require('../plugins/i18n');

const allowedTypes = ['event', 'user'];

router.use('/:type?', ({ params, query }, res) => {
  const q = {
    index: elasticsearch.INDEX,
    body: {
      query: {
        query_string: {
          query: query.q
        }
      }
    }
  };
  if (params.type !== null && _.includes(allowedTypes, params.type)) {
    q.type = params.type;
  }
  
  /*
  if (query.q !== null && query.q !== '') {
    q.body.q = `${query.q}`;
  } else {
    q.body.q = '*';
}*/
  logger.debug('Search with the following query', q);
  elasticsearch.search(q, (err, results) => {
/*
    if (err) {
    res.send(err);
    }
    res.send(results);
*/
  logger.debug(results.hits.hits);
    res.render('search', {
      title: i18n.__('Results'),
      data: results.hits.hits,
      q: query.q
    });
  });
});

module.exports = router;
