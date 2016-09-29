import CustomField from './custom_field.es6'

class TextCustomField extends CustomField {

  constructor(props) {
    super(props)
    this.state.value = this.props.customField.value || ''
  }

  buildParams() {
    return {
      customField: {
        textValue: this.state.value
      }
    }
  }

  updateValue(e) {
    this.setState({
      value: e.target.value
    })
  }

  renderValue() {
    return (
      <span>{this.props.customField.value}</span>
    )
  }

  renderValueInput() {
    return (
      <input type="text"
             value={this.state.value}
             onChange={this.updateValue.bind(this)} />
    )
  }

}

module.exports = TextCustomField
