$(function() {
  $('.navbar ul.sections').on('click', 'a', (e) => {
    if(typeof browserHistory !== 'undefined') {
      var locationParts = e.target.href.split('/')
      var location      = locationParts.slice(4, locationParts.length).join('/')

      console.log(location)

      browserHistory.push(location)

      return false
    }
  })
})
