class HttpService {

  static get(url, request, callback, failCallback) {
    request = humps.decamelizeKeys(request)

    var req = $.get(url, request, (response) => {
      response = humps.camelizeKeys(response)

      if(callback)
        callback(response)
    })

    if(failCallback)
      req.fail(failCallback)
  }

  static post(url, request, callback) {
    request = humps.decamelizeKeys(request)

    $.post(url, request, (response) => {
      response = humps.camelizeKeys(response)

      if(callback)
        callback(response)
    })
  }

  static put(url, request, callback) {
    this.post(url, _.merge({ _method: 'PUT' }, request), callback)
  }

  static delete(url, request, callback) {
    this.post(url, _.merge({ _method: 'DELETE' }, request), callback)
  }

}

module.exports = HttpService
