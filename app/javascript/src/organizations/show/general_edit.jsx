export default class GeneralEdit extends React.Component {
  constructor(props) {
    super(props)

    console.log(this.props.organization)

    this.state = {
      name:          this.props.organization.name,
      status:        this.props.organization.status,
      description:   this.props.organization.description,
      websiteUrl:    this.props.organization.websiteUrl,
      companyNumber: this.props.organization.companyNumber,
      address1:      this.props.organization.address1,
      address2:      this.props.organization.address2,
      city:          this.props.organization.city,
      state:         this.props.organization.state,
      zip:           this.props.organization.zip,
      country:       this.props.organization.country,
      errors:        ''
    }
  }

  backendUpdateOrganization() {
    var params = {
      organization: {
        name:          this.state.name,
        status:        this.state.status,
        description:   this.state.description,
        websiteUrl:    this.state.websiteUrl,
        companyNumber: this.state.companyNumber,
        address1:      this.state.address1,
        address2:      this.state.address2,
        city:          this.state.city,
        state:         this.state.state,
        zip:           this.state.zip,
        country:       this.state.country
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

  updateCompanyNumber(e) {
    this.setState({
      companyNumber: e.target.value
    })
  }

  updateAddress1(e) {
    this.setState({
      address1: e.target.value
    })
  }

  updateAddress2(e) {
    this.setState({
      address2: e.target.value
    })
  }

  updateCity(e) {
    this.setState({
      city: e.target.value
    })
  }

  updateState(e) {
    this.setState({
      state: e.target.value
    })
  }

  updateZip(e) {
    this.setState({
      zip: e.target.value
    })
  }

  updateCountry(e) {
    this.setState({
      country: e.target.value
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

            { this.renderCompanyNumber() }
            { this.renderAddress() }
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
                  name="description"
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
               name="website"
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

  renderCompanyNumber() {
    return (
      <div className="company-number">
        <label>Numéro d'entreprise / TVA</label><br />

        <input type="text"
               className="company-number full"
               placeholder="Numéro d'entreprise"
               defaultValue={this.state.companyNumber}
               onChange={this.updateCompanyNumber.bind(this)} />
      </div>
    )
  }

  renderAddress() {
    return (
      <div className="address-form">
        <label>Adresse</label><br />

        <input type="text"
               className="address1 full"
               placeholder="Ligne 1"
               defaultValue={this.state.address1}
               onChange={this.updateAddress1.bind(this)} /><br />

        <input type="text"
               className="address2 full"
               placeholder="Ligne 2"
               defaultValue={this.state.address2}
               onChange={this.updateAddress2.bind(this)} /><br />

        <input type="text"
               className="zip full"
               placeholder="Code postal"
               defaultValue={this.state.zip}
               onChange={this.updateZip.bind(this)} /><br />

        <input type="text"
               className="city full"
               placeholder="Localité"
               defaultValue={this.state.city}
               onChange={this.updateCity.bind(this)} /><br />

        <input type="text"
               className="country full"
               placeholder="Pays"
               defaultValue={this.state.country}
               onChange={this.updateCountry.bind(this)} />
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
