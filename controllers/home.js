exports.index = (req, res) => {
  res.render('home', {
    title: __('Welcome')
  });
};
