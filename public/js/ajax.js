const request = (url, method, payload) => {
  $.ajax({
    url: url,
    method: method,
    data: payload
  }).done(function() {
    window.location.reload();
  });
}

$(document).on('click', '.ajax', function(ev) {
  ev.preventDefault();
  const $el = $(this);
  const url = $el.attr('data-endpoint');
  const method = $el.attr('data-method');
  const payload = JSON.parse($el.attr('data-payload'));
  const confirm = $el.attr('data-confirm');
  if (confirm) {
    bootbox.confirm({
      size: 'small',
      message: 'Are you sure?',
      closeButton: false,
      callback: function(result) {
        if (result) {
          request(url, method, payload);
        }
      }
    });
  } else {
    request(url, method, payload);
  }
});
