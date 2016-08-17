// JQUERY

$(document).bind("ajaxSend", (elm, xhr, s) => {
  if(s.type == 'POST') {
    csrfToken = $('meta[name="csrf-token"]').attr('content')
    xhr.setRequestHeader('X-CSRF-Token', csrfToken)
  }
})
