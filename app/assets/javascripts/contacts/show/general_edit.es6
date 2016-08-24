import SelectFilter from '../shared/select_filter.es6'

class GeneralEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName:       this.props.contact.firstName,
      lastName:        this.props.contact.lastName,
      addressStreet:   this.props.contact.addressStreet,
      addressZipCode:  this.props.contact.addressZipCode,
      addressCity:     this.props.contact.addressCity,
      addressCountry:  this.props.contact.addressCountry,
      phone:           this.props.contact.phone,
      email:           this.props.contact.email,
      organizationIds: this.props.contact.organizationIds,
      fieldIds:        this.props.contact.fieldIds
    };
  }

  backendUpdateContact() {
    var params = {
      _method: 'PUT',
      contact: {
        firstName:       this.state.firstName,
        lastName:        this.state.lastName,
        addressStreet:   this.state.addressStreet,
        addressZipCode:  this.state.addressZipCode,
        addressCity:     this.state.addressCity,
        addressCountry:  this.state.addressCountry,
        phone:           this.state.phone,
        email:           this.state.email,
        organizationIds: this.state.organizationIds,
        fieldIds:        this.state.fieldIds
      }
    }

    $.post(this.props.contactPath, humps.decamelizeKeys(params), (data) => {
      this.props.reloadFromBackend(this.props.toggleEditMode)
    });
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

  updateOrganizationIds(value) {
    this.setState({
      organizationIds: value.split(',')
    });
  }

  updateFieldIds(value) {
    this.setState({
      fieldIds: value.split(',')
    });
  }

  render() {
    return (
      <div className="general edit">
        <Link to={'/' + this.props.search} className="back">
          Retour
        </Link>

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>
          <div className="col-md-8">
            <h1>
              { this.renderName() }
            </h1>
            <div className="organizations">
              { this.renderOrganizations() }
            </div>
            <div className="fields">
              { this.renderFields() }
            </div>
          </div>
        </div>

        <div className="row row-contact-infos">
          { this.renderAddress() }
          { this.renderPhone() }
          { this.renderEmail() }
        </div>

        { this.renderActions() }
      </div>
    );
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.contact.pictureUrl} />
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

  renderOrganizations() {
    return (
      <SelectFilter itemIds={this.state.organizationIds.join(',')}
                    optionsPath={this.props.organizationOptionsPath}
                    updateValue={this.updateOrganizationIds.bind(this)}
                    label="Organisations" />
    )
  }

  renderFields() {
    <SelectFilter itemIds={this.state.fieldIds.join(',')}
                  optionsPath={this.props.fieldOptionsPath}
                  updateValue={this.updateFieldIds.bind(this)}
                  label="Fields" />
  }

  renderAddress() {
    return (
      <div className="col-md-4">
        <h3>Adresse</h3>

        <div className="address">
          <input type="text"
                 className="street"
                 defaultValue={this.state.addressStreet}
                 onChange={this.updateAddressStreet.bind(this)} />
          <br/>
          <input type="text"
                 className="zip-code"
                 defaultValue={this.state.addressZipCode}
                 onChange={this.updateAddressZipCode.bind(this)} />
          <input type="text"
                 className="city"
                 defaultValue={this.state.addressCity}
                 onChange={this.updateAddressCity.bind(this)} />
          <br/>
          <input type="text"
                 className="country"
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
        <button className="btn btn-secondary"
                onClick={this.props.toggleEditMode}>
          Annuler
        </button>

        <button className="btn btn-secondary"
                onClick={this.backendUpdateContact.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = GeneralEdit
