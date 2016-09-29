class CustomField extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false
    }
  }

  render() {
    return (
      <div>
        <label>{this.props.customField.name}</label>

        {this.renderValue()}
      </div>
    )
  }

  renderValue() {
    if(this.state.editMode) {

    }
    else {
      return (
        <div>{this.props.customField.value}</div>
      )
    }
  }

}

module.exports = CustomField
