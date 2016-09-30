import CustomFieldFilter from './custom_field_filter.es6'

class BoolCustomFieldFilter extends CustomFieldFilter {

  updateValue(value) {
    var newFilters = {}
    newFilters[`customField${this.props.customField.id}`] = value.toString()
    this.props.updateFilters(newFilters)
  }

  renderInput() {
    const name    = `custom_field_${this.props.customField.id}`
    const bothId  = `custom_field_${this.props.customField.id}_both`
    const trueId  = `custom_field_${this.props.customField.id}_true`
    const falseId = `custom_field_${this.props.customField.id}_false`

    var value = this.getValue()

    return (
      <div className="bool-choices">
        <input type="radio"
               name={name}
               id={bothId}
               checked={value == ''}
               onChange={this.updateValue.bind(this, '')} />

        <label htmlFor={trueId}>Tous</label>

        <input type="radio"
               name={name}
               id={trueId}
               checked={value == 'true'}
               onChange={this.updateValue.bind(this, 'true')} />

        <label htmlFor={trueId}>Oui</label>

        <input type="radio"
               name={name}
               id={falseId}
               checked={value == 'false'}
               onChange={this.updateValue.bind(this, 'false')} />

        <label htmlFor={falseId}>Non</label>
      </div>
    )
  }

}

module.exports = BoolCustomFieldFilter
