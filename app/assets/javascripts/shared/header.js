$(function() {
  $('.navbar ul.sections, .navbar-header').on('click', 'a', (e) => {
    if(typeof browserHistory !== 'undefined') {
      var locationParts = e.target.href.split('/')
      var location      = locationParts.slice(4, locationParts.length).join('/')

      browserHistory.push(location)

      return false
    }
  })
})
