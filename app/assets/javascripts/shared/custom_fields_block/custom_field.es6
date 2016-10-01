class CustomField extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false
    }
  }

  setEditMode(mode = true) {
    this.setState({
      editMode: mode
    })
  }

  save() {
    const path = `${this.props.item.path}/custom_fields/${this.props.customField.id}`

    http.put(path, this.buildParams(), () => {
      this.setEditMode(false)
    })
  }

  render() {
    return (
      <div className="custom-field">
        <label>{this.props.customField.name}</label>

        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if(this.state.editMode) {
      return this.renderValueEditMode()
    }
    else {
      return this.renderValueShowMode()
    }
  }

  renderValueShowMode() {
    return (
      <div className="show-mode">
        {this.renderValue()}

        <button className="btn btn-xs btn-primary"
                onClick={this.setEditMode.bind(this, true)}>
          <i className="fa fa-edit"></i>
        </button>
      </div>
    )
  }

  renderValueEditMode() {
    return (
      <div className="edit-mode">
        {this.renderValueInput()}

        <button className="btn btn-xs btn-success"
                onClick={this.save.bind(this)}>
          <i className="fa fa-check"></i>
        </button>
      </div>
    )
  }

}

module.exports = CustomField
