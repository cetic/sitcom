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
    if(_.trim(this.props.customField.value).length) {
      return (
        <span className="text">
          {this.props.customField.value}
        </span>
      )
    }
    else {
      return (
        <span className="text">
          <em>Non spécifié</em>
        </span>
      )
    }
  }

  renderValueInput() {
    return (
      <textarea type="text"
                defaultValue={this.state.value}
                onChange={this.updateValue.bind(this)}>
      </textarea>
    )
  }

}

module.exports = TextCustomField
