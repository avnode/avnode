const router = require('./router')();

router.get('/:filename', ({params}, res, _next) => {
  const options = {
    root: `${__dirname}/../../${process.env.STORAGE}`
  };
  res.sendFile(params.filename, options, (err) => {
    if (err) {
      console.log(err);
      res.redirect('/404');
    }
  });
});

module.exports = router;
