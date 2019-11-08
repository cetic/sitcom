import CustomFieldFilter from './custom_field_filter.jsx'

export default class TextCustomFieldFilter extends CustomFieldFilter {

  updateValue(e) {
    var newFilters = {}
    newFilters[`customField${this.props.customField.id}`] = e.target.value
    this.props.updateFilters(newFilters)
  }

  renderInput() {
    return (
      <input type="text"
             className="form-control input-sm"
             value={this.getValue()}
             onChange={this.updateValue.bind(this)} />
    )
  }

}
