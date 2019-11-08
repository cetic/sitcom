class GeneralEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name:        this.props.organization.name,
      status:      this.props.organization.status,
      description: this.props.organization.description,
      websiteUrl:  this.props.organization.websiteUrl,
      errors:      ''
    }
  }

  backendUpdateOrganization() {
    var params = {
      organization: {
        name:        this.state.name,
        status:      this.state.status,
        description: this.state.description,
        websiteUrl:  this.state.websiteUrl
      }
    }

    http.put(this.props.organizationPath, params, (data) => {
      if(!data.success) {
        this.setState({ errors: data.errors })
      }
      else {
        this.props.toggleEditMode()
      }
    })
  }

  updateName(e) {
    this.setState({
      name: e.target.value
    })
  }

  updateStatus(e) {
    this.setState({
      status: e.target.value
    })
  }

  updateDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  updateWebsiteUrl(e) {
    this.setState({
      websiteUrl: e.target.value
    })
  }

  render() {
    return (
      <div className="general edit">
        <Link to={'/organizations' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-md-12">
            { this.renderErrors() }
          </div>

          <div className="col-sm-3 col-xs-4">
            { this.renderPicture() }
          </div>

          <div className="col-sm-9">
            <h1>
              { this.renderName() }
            </h1>

            { this.renderStatus() }

            { this.renderWebsite() }
            { this.renderDescription() }
          </div>
        </div>

        { this.renderActions() }
      </div>
    )
  }

  renderErrors() {
    if(this.state.errors.length) {
      return (
        <div className="alert alert-danger" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          { this.state.errors }
        </div>
      )
    }
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.organization.previewPictureUrl} />
      </div>
    )
  }

  renderName() {
    return (
      <div className="name">
        <input type="text"
               className="name full"
               placeholder="Nom de l'organisation"
               defaultValue={this.state.name}
               onChange={this.updateName.bind(this)} />
      </div>
    )
  }

  renderDescription() {
    return (
      <div className="description">
        <label>Description</label>

        <textarea className="description"
                  defaultValue={this.state.description}
                  onChange={this.updateDescription.bind(this)} />
      </div>
    )
  }

  renderWebsite() {
    return (
      <div className="website">
        <label>Site Web</label>

        <input type="text"
               className="website-url"
               defaultValue={this.state.websiteUrl}
               onChange={this.updateWebsiteUrl.bind(this)} />
      </div>
    )
  }

  renderStatus() {
    return (
      <div className="status">
        <input type="text"
               placeholder="Statut"
               defaultValue={this.state.status}
               onChange={this.updateStatus.bind(this)} />
      </div>
    )
  }

  renderActions() {
    return (
      <div className="actions">
        <button className="btn btn-default"
                onClick={this.props.toggleEditMode}>
          Annuler
        </button>

        <button className="btn btn-primary"
                onClick={this.backendUpdateOrganization.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = GeneralEdit
