$(function() {
  if(
    $('html#admin-custom_fields-new'   ).length ||
    $('html#admin-custom_fields-create').length ||
    $('html#admin-custom_fields-edit'  ).length ||
    $('html#admin-custom_fields-updaye').length
  ) {

    var toggleOptions = function() {
      console.log('toggleOptions')
      var fieldType = $('#custom_field_field_type').val()
      console.log(fieldType)
      $('#enum-options').toggle(fieldType == 'enum')
    }

    $('body').on('change', '#custom_field_field_type', function() {
      toggleOptions()
    })

    toggleOptions()
  }
})
