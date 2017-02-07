const router = require('./router')();
const elasticsearch = require('../plugins/elasticsearch').getClient();
const _ = require('lodash');
const logger = require('../utilities/logger');
const i18n = require('../plugins/i18n');

const allowedTypes = ['event', 'user', 'crew'];

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
  
  logger.debug('Search with the following query', q);
  elasticsearch.search(q, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    logger.debug('Results', results.hits.hits);
    res.render('search', {
      title: i18n.__('Results'),
      data: results.hits.hits,
      resultCount: results.hits.total,
      q: query.q
    });
  });
});

module.exports = router;
