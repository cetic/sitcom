class Organization extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      role:     props.organizationLink.role
    }
  }

  remove() {
    this.props.removeOrganization(this.props.organizationLink.organization)
  }

  updateRole(e) {
    this.setState({ role: e.target.value })
  }

  saveOnEnter(e) {
    if(e.key == 'Enter') {
      http.put(this.props.organizationLink.path, {
        [`${this.props.linkName}`]: {
          role: this.state.role
        }
      }, () => {
        this.setState({ editMode: false })
      })
    }
  }

  setEditMode(editMode) {
    this.setState({ editMode: editMode })
  }

  render() {
    return (
      <div className="col-md-6 association organization">
        {this.renderInside()}
      </div>
    )
  }

  renderInside() {
    const organization = this.props.organizationLink.organization

    return (
      <div className="association-inside">
        <img className="img-thumbnail" src={organization.thumbPictureUrl} />
        <h4>
          <Link to={organization.scopedPath}>
            {organization.name}
          </Link>
        </h4>

        {this.renderRole()}
        {this.renderRemoveIcon()}
      </div>
    )
  }

  renderRole() {
    if(this.state.editMode) {
      return (
        <div>
          <input type="text"
                 value={this.state.role}
                 onChange={this.updateRole.bind(this)}
                 onKeyPress={this.saveOnEnter.bind(this)} />

          <a href="javascript:;"
             onClick={this.setEditMode.bind(this, false)}>Annuler</a>
        </div>
      )
    }
    else {
      return (
        <div>
          <span>{this.props.organizationLink.role}</span>

          &nbsp;<a href="javascript:;"
             onClick={this.setEditMode.bind(this, true)}>Modifier</a>
        </div>
      )
    }
  }

  renderRemoveIcon() {
    if(this.props.canWrite) {
      return (
        <i className="fa fa-times remove-icon"
          onClick={this.remove.bind(this)}>
        </i>
      )
    }
  }

}

module.exports = Organization
