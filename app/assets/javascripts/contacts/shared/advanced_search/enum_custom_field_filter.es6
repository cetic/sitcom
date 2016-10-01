import Select            from 'react-select'
import CustomFieldFilter from './custom_field_filter.es6'

class EnumCustomFieldFilter extends CustomFieldFilter {

  updateValue(option) {
    var newFilters = {}
    newFilters[`customField${this.props.customField.id}`] = option ? option.value : undefined
    this.props.updateFilters(newFilters)
  }

  renderInput() {
    const options = this.getSelectOptions()
    const value   = this.getSelectValue(options)

    return (
      <Select multi={false}
              value={value}
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
    const value = this.getValue()

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
