class LinkRole extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      role:     props.link.role
    }
  }

  updateRole(e) {
    this.setState({ role: e.target.value })
  }

  saveOnEnter(e) {
    if(this.props.canWrite) {
      if(e.key == 'Enter') {
        http.put(this.props.link.path, {
          [`${this.props.linkName}`]: {
            role: this.state.role
          }
        }, () => {
          this.setState({ editMode: false })
        })
      }
    }
  }

  setEditMode(editMode) {
    this.setState({ editMode: editMode }, () => {
      if(editMode) {
        $(this.refs.input).focus()
      }
    })
  }

  render() {
    if(this.props.canWrite && this.state.editMode) {
      return (
        <div>
          <input type="text"
                 ref="input"
                 value={this.state.role}
                 onChange={this.updateRole.bind(this)}
                 onKeyPress={this.saveOnEnter.bind(this)} />

          <a href="javascript:;"
             style={{ marginLeft: '5px' }}
             onClick={this.setEditMode.bind(this, false)}>Annuler</a>
        </div>
      )
    }
    else {
      return (
        <div>
          <span>{this.state.role}</span>
          {this.renderEditLink()}
        </div>
      )
    }
  }

  renderEditLink() {
    if(this.props.canWrite) {
      const style = { marginLeft: _.trim(this.state.role).length > 0 ? '5px' : '0px' }

      return (
        <a href="javascript:;"
           style={style}
           className="edit-role"
           onClick={this.setEditMode.bind(this, true)}>Modifier le rôle</a>
      )
    }
  }



}

module.exports = LinkRole
