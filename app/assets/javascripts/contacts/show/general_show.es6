import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  destroyContact() {
    if(confirm("Supprimer ce contact ?")) {
      http.delete(this.props.contactPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('contacts')
          setTimeout(this.props.reloadIndexFromBackend, 1500)
        }
      });
    }
  }

  render() {
    return (
      <div className="general">
        <Link to={'/contacts' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderActivity() }
        { this.renderEdit() }
        { this.renderDestroy() }

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-8">
            <h1>{ this.props.contact.name }</h1>

            <div className="activity-text">
              { this.renderActivityText() }
            </div>

            <div className="organizations">
              { this.renderOrganizations() }
            </div>

            <ul className="fields">
              { this.renderFields() }
            </ul>
          </div>
        </div>

        <div className="row row-contact-infos">
          { this.renderAddress() }
          { this.renderPhone() }
          { this.renderEmail() }
        </div>
      </div>
    );
  }

  renderActivity() {
    var activityClass = 'activity'
    activityClass     += this.props.contact.active ? ' active' : ''

    return (
      <div className={activityClass}>
        <div className="activity-inside">&nbsp;
        </div>
      </div>
    )
  }

  renderEdit() {
    return(
      <button className="btn btn-secondary btn-edit"
              onClick={this.props.toggleEditMode}>
        Modifier
      </button>
    )
  }

  renderDestroy() {
    return(
      <button className="btn btn-secondary btn-edit"
              onClick={this.destroyContact.bind(this)}>
        Supprimer
      </button>
    )
  }

  renderPicture() {
    return (
      <CustomDropzone url={this.props.contactPath}
                      afterSuccess={this.props.reloadFromBackend}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.contact.previewPictureUrl} />
      </CustomDropzone>
    )
  }

  renderActivityText() {
    // if(this.props.contact.active)
    //   return "actif"
    // else
    //   return "inactif"
  }

  renderOrganizations() {
    return _.map(this.props.contact.organizations, (organization, i) => {
      return (
        <span key={organization.id}>
          <Link to={'/organizations/' + organization.id}>
            {organization.name}
          </Link>
          { this.props.contact.organizations.length - 1 == i ? '' : ','}
        </span>
      )
    })
  }

  renderFields() {
    return _.map(this.props.contact.fields, (field) => {
      return (
        <li className="field" key={ field.id }>
          <span className="label label-default">{ field.name }</span>
        </li>
      )
    })
  }

  renderAddress() {
    var address = () => {
      if(this.props.contact.address == '')
        return <em>non-renseignée</em>;
      else
        return (
          <div className="address">
            { this.props.contact.addressStreet }
            <br/>
            { this.props.contact.addressZipCode } { this.props.contact.addressCity }
            <br/>
            { this.props.contact.addressCountry }
          </div>
        )
    }

    return (
      <div className="col-md-4">
        <h3>Adresse</h3>

        { address() }
      </div>
    )
  }

  renderPhone() {
    var phone = () => {
      if(this.props.contact.phone == '')
        return <em>non-renseigné</em>;
      else
        return (
          <span title={this.props.contact.phone}>
            {this.props.contact.phone}
          </span>
        )
    }

    return (
      <div className="col-md-4">
        <h3>Téléphone</h3>

        { phone() }
      </div>
    )
  }

  renderEmail() {
    var email = () => {
      if(this.props.contact.email == '')
        return <em>non-renseigné</em>;
      else
        return (
          <a title={this.props.contact.email}
             href={ "mailto:" + this.props.contact.email }
             target="_blank">
            {this.props.contact.email}
          </a>
        )
    }

    return (
      <div className="col-md-4">
        <h3>Email</h3>

        { email() }
      </div>
    )
  }
}

module.exports = GeneralShow
