$(function() {
  if(
    $('html#admin-custom_fields-new'   ).length ||
    $('html#admin-custom_fields-create').length ||
    $('html#admin-custom_fields-edit'  ).length ||
    $('html#admin-custom_fields-update').length
  ) {
    var toggleOptions = function() {
      var fieldType = $('#custom_field_field_type').val()
      $('#enum-options').toggle(fieldType == 'enum')
    }

    $('body').on('change', '#custom_field_field_type', function() {
      toggleOptions()
    })

    toggleOptions()
  }
})
