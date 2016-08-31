class GeneralEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.organization.name,
      description: this.props.organization.description,
      websiteUrl:  this.props.organization.websiteUrl,
      errors:      ''
    };
  }

  backendUpdateOrganization() {
    var params = {
      _method: 'PUT',
      organization: {
        name:        this.state.name,
        description: this.state.description,
        websiteUrl:  this.state.websiteUrl
      }
    }

    $.post(this.props.organizationPath, humps.decamelizeKeys(params), (data) => {
      var camelData = humps.camelizeKeys(data);

      if(!camelData.success) {
        this.setState({ errors: camelData.errors })
      }
      else {
        this.props.reloadFromBackend(this.props.toggleEditMode)
      }
    });
  }

  updateName(e) {
    this.setState({
      name: e.target.value
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
        <Link to={'/' + this.props.search} className="back">
          Retour
        </Link>

        <div className="row">
          <div className="col-md-12">
            { this.renderErrors() }
          </div>

          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-9">
            <h1>
              { this.renderName() }
            </h1>
          </div>
        </div>

        <div className="row row-organization-infos">
          { this.renderDescription() }
          { this.renderWebsiteUrl() }
        </div>

        { this.renderActions() }
      </div>
    );
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
        <img className="img-thumbnail" src={this.props.organization.pictureUrl} />
      </div>
    )
  }

  renderName() {
    return (
      <div className="name">
        <input type="text"
               className="name"
               defaultValue={this.state.name}
               onChange={this.updateName.bind(this)} />
      </div>
    )
  }

  renderDescription() {
    return (
      <div className="col-md-4">
        <h3>Description</h3>

        <textarea className="description"
                  defaultValue={this.state.description}
                  onChange={this.updateDescription.bind(this)} />
      </div>
    )
  }

  renderWebsiteUrl() {
    return (
      <div className="col-md-4">
        <h3>Site Web</h3>

        <input type="text"
               className="website-url"
               defaultValue={this.state.websiteUrl}
               onChange={this.updateWebsiteUrl.bind(this)} />
      </div>
    )
  }

  renderActions() {
    return (
      <div className="actions">
        <button className="btn btn-secondary"
                onClick={this.props.toggleEditMode}>
          Annuler
        </button>

        <button className="btn btn-secondary"
                onClick={this.backendUpdateOrganization.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = GeneralEdit
