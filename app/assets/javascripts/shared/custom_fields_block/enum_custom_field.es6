import Select      from 'react-select'
import CustomField from './custom_field.es6'

class EnumCustomField extends CustomField {

  constructor(props) {
    super(props)
    this.state.value = this.props.customField.value || ''
  }

  componentWillReceiveProps(newProps) {
    if(newProps.customField.value != this.props.customField.value) {
      this.setState({
        value: newProps.customField.value
      })
    }
  }

  buildParams() {
    return {
      customField: {
        textValue: this.state.value
      }
    }
  }

  updateValue(option) {
    this.setState({
      value: option ? option.value : ''
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
    if(_.trim(this.state.value) != '') {
      var option = _.find(options, (option) => {
        return option.value == this.state.value
      })

      return {
        label: option.label,
        value: option.value
      }
    }
  }

}

module.exports = EnumCustomField
