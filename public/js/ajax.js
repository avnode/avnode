$(document).on('click', '.ajax', function(ev) {
  ev.preventDefault();
  const $el = $(this);
  const url = $el.attr('data-endpoint');
  const method = $el.attr('data-method');
  const payload = JSON.parse($el.attr('data-payload'));
  $.ajax({
    url: url,
    method: method,
    data: payload
  }).done(function() {
    window.location.reload();
  });
});
