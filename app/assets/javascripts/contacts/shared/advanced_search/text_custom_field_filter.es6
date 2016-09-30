import CustomFieldFilter from './custom_field_filter.es6'

class TextCustomFieldFilter extends CustomFieldFilter {

  updateValue(e) {
    var newFilters = {}
    newFilters[`customField${this.props.customField.id}`] = e.target.value
    this.props.updateFilters(newFilters)
  }

  renderInput() {
    return (
      <input type="text"
             value={this.getValue()}
             onChange={this.updateValue.bind(this)} />
    )
  }

}

module.exports = TextCustomFieldFilter
