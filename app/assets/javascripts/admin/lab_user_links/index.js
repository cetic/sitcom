$(function() {
  if($('html#admin-lab_user_links-index').length) {
    var syncGroup = function(classPrefix) {
      var readCheckbox  = $('.table input[type=checkbox].' + classPrefix + '-read');
      var writeCheckbox = $('.table input[type=checkbox].' + classPrefix + '-write');

      if(writeCheckbox.prop('checked')) {
        readCheckbox.prop('checked', true);
        readCheckbox.prop('disabled', true);
      }
      else {
        readCheckbox.prop('disabled', false);
      }
    };

    $('.table').on('click', 'input[type=checkbox]', function() {
      var classPrefix = $(this).attr('class').split('-')[0];
      syncGroup(classPrefix);
    })

    $('.table input[type=checkbox]').each(function() {
      var classPrefix = $(this).attr('class').split('-')[0];
      syncGroup(classPrefix);
    });
  }
});
