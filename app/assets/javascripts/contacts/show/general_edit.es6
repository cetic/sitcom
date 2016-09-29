import ItemsSelect from '../../shared/items_select.es6'

class GeneralEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName:       this.props.contact.firstName,
      lastName:        this.props.contact.lastName,
      active:          this.props.contact.active,
      addressStreet:   this.props.contact.addressStreet,
      addressZipCode:  this.props.contact.addressZipCode,
      addressCity:     this.props.contact.addressCity,
      addressCountry:  this.props.contact.addressCountry,
      phone:           this.props.contact.phone,
      email:           this.props.contact.email,
      fieldIds:        this.props.contact.fieldIds,
      tagIds:          this.props.contact.tagIds,
      errors:          ''
    }
  }

  backendUpdateContact() {
    var params = {
      contact: {
        firstName:       this.state.firstName,
        lastName:        this.state.lastName,
        active:          this.state.active,
        addressStreet:   this.state.addressStreet,
        addressZipCode:  this.state.addressZipCode,
        addressCity:     this.state.addressCity,
        addressCountry:  this.state.addressCountry,
        phone:           this.state.phone,
        email:           this.state.email,
        fieldIds:        this.state.fieldIds,
        tagIds:          this.state.tagIds
      }
    }

    http.put(this.props.contactPath, params, (data) => {
      if(!data.success) {
        this.setState({ errors: data.errors })
      }
      else {
        this.props.toggleEditMode()
      }
    })
  }

  updateFirstName(e) {
    this.setState({
      firstName: e.target.value
    })
  }

  updateLastName(e) {
    this.setState({
      lastName: e.target.value
    })
  }

  toggleActive() {
    this.setState({
      active: !this.state.active
    })
  }

  updateAddressStreet(e) {
    this.setState({
      addressStreet: e.target.value
    })
  }

  updateAddressZipCode(e) {
    this.setState({
      addressZipCode: e.target.value
    })
  }

  updateAddressCity(e) {
    this.setState({
      addressCity: e.target.value
    })
  }

  updateAddressCountry(e) {
    this.setState({
      addressCountry: e.target.value
    })
  }

  updatePhone(e) {
    this.setState({
      phone: e.target.value
    })
  }

  updateEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  updateFieldIds(value) {
    this.setState({
      fieldIds: value.split(',')
    })
  }

  updateTagIds(value) {
    this.setState({
      tagIds: value.split(',')
    })
  }

  render() {
    return (
      <div className="general edit">
        <Link to={'/contacts' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-md-12">
            { this.renderErrors() }
          </div>

          <div className="col-md-3">
            { this.renderPicture() }
            { this.renderActive() }
          </div>
          <div className="col-md-9">
            <h1>
              { this.renderName() }
            </h1>
            <div className="fields">
              { this.renderFields() }
              { this.renderTags() }
            </div>
          </div>
        </div>

        <div className="row row-contact-infos">
          { this.renderAddress() }
          { this.renderPhone() }
          { this.renderEmail() }
        </div>

        <div className="row">
          <div className="col-md-12">
            { this.renderActions() }
          </div>
        </div>
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
        <img className="img-thumbnail" src={this.props.contact.previewPictureUrl} />
      </div>
    )
  }

  renderActive() {
    return (
      <div className="active">
        <label htmlFor="active">Actif</label>
        <input type="checkbox" checked={this.state.active}
                               onChange={this.toggleActive.bind(this)}
                               id="active" />
      </div>
    )
  }

  renderName() {
    return (
      <div className="name">
        <input type="text"
               className="first-name"
               defaultValue={this.state.firstName}
               onChange={this.updateFirstName.bind(this)} />
        <input type="text"
               className="last-name"
               defaultValue={this.state.lastName}
               onChange={this.updateLastName.bind(this)} />
      </div>
    )
  }

  renderFields() {
    return (
      <ItemsSelect itemIds={this.state.fieldIds.join(',')}
                   optionsPath={this.props.fieldOptionsPath}
                   updateValue={this.updateFieldIds.bind(this)}
                   label="Domaines d'expertise" />
    )
  }

  renderTags() {
    return (
      <ItemsSelect itemIds={this.state.tagIds.join(',')}
                   optionsPath={this.props.tagOptionsPath}
                   updateValue={this.updateTagIds.bind(this)}
                   label="Groupes" />
    )
  }

  renderAddress() {
    return (
      <div className="col-md-4">
        <h3>Adresse</h3>

        <div className="address">
          <input type="text"
                 className="street"
                 placeholder="Rue"
                 defaultValue={this.state.addressStreet}
                 onChange={this.updateAddressStreet.bind(this)} />
          <br/>
          <input type="text"
                 className="zip-code"
                 placeholder="Code postal"
                 defaultValue={this.state.addressZipCode}
                 onChange={this.updateAddressZipCode.bind(this)} />
          <input type="text"
                 className="city"
                 placeholder="Ville"
                 defaultValue={this.state.addressCity}
                 onChange={this.updateAddressCity.bind(this)} />
          <br/>
          <input type="text"
                 className="country"
                 placeholder="Pays"
                 defaultValue={this.state.addressCountry}
                 onChange={this.updateAddressCountry.bind(this)} />
        </div>
      </div>
    )
  }

  renderPhone() {
    return (
      <div className="col-md-4">
        <h3>Téléphone</h3>

        <input type="text"
               className="phone"
               defaultValue={this.state.phone}
               onChange={this.updatePhone.bind(this)} />
      </div>
    )
  }

  renderEmail() {
    return (
      <div className="col-md-4">
        <h3>Email</h3>

        <input type="text"
               className="email"
               defaultValue={this.state.email}
               onChange={this.updateEmail.bind(this)} />
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
                onClick={this.backendUpdateContact.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = GeneralEdit
