$(function() {
  if(
    $('html#admin-custom_fields-new'   ).length ||
    $('html#admin-custom_fields-create').length ||
    $('html#admin-custom_fields-edit'  ).length ||
    $('html#admin-custom_fields-updaye').length
  ) {

    var toggleOptions = function() {
      var fieldType = $('#custom_field_field_type').val()
      $('#enum-options').toggle(fieldType == 'enum')
    }

    $('body').on('change', '#custom_field_field_type', function() {
      toggleOptions()
    })

    $('body').on('click', '#new-option-button', function(e) {
      e.preventDefault()

      var name = _.trim($('#new-option').val())

      if(name.length) {
        $('#enum-options table tbody').append(
          '<tr><td colspan="2">' + name + '<input type="hidden" name="custom_field[options][]" value="' + name + '" /></td></tr>'
        )
      }
    })

    toggleOptions()
  }
})
