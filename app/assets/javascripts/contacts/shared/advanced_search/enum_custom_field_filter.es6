import Select            from 'react-select'
import CustomFieldFilter from './custom_field_filter.es6'

class EnumCustomFieldFilter extends CustomFieldFilter {

  updateValue(value) {
    console.log(value)
  }

  renderInput() {
    const options = this.getSelectOptions()

    return (
      <Select multi={false}
              value={this.getSelectValue(options)}
              options={options}
              onChange={this.updateValue.bind(this)} />
    )
  }

  getSelectOptions() {
    return _.map(this.props.customField.options, (option) => {
      return {
        label: option,
        value: option
      }
    })
  }

  getSelectValue(options) {
    var value = ''

    if(_.trim(value) != '') {
      var option = _.find(options, (option) => {
        return option.value == value
      })

      return {
        label: option.label,
        value: option.value
      }
    }
  }

}

module.exports = EnumCustomFieldFilter
