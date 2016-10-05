import CustomField from './custom_field.es6'

class BoolCustomField extends CustomField {

  constructor(props) {
    super(props)
    this.state.value = this.props.customField.value == 'true'
  }

  buildParams() {
    return {
      customField: {
        boolValue: this.state.value
      }
    }
  }

  updateValue(value, e) {
    this.setState({
      value: value
    })
  }

  renderValue() {
    return (
      <span className="text">
        {this.state.value ? 'Oui' : 'Non'}
      </span>
    )
  }

  renderValueInput() {
    const name    = `custom_field_${this.props.customField.id}`
    const trueId  = `custom_field_${this.props.customField.id}_true`
    const falseId = `custom_field_${this.props.customField.id}_false`

    console.log(this.state.value)

    return (
      <div className="bool-choices">
        <input type="radio"
               name={name}
               id={trueId}
               checked={this.state.value}
               onChange={this.updateValue.bind(this, true)} />

        <label htmlFor={trueId}>Oui</label>

        <input type="radio"
               name={name}
               id={falseId}
               checked={!this.state.value}
               onChange={this.updateValue.bind(this, false)} />

        <label htmlFor={falseId}>Non</label>
      </div>
    )
  }

}

module.exports = BoolCustomField
