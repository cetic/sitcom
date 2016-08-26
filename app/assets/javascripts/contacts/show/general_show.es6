class GeneralShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className="general">
        <Link to={'/contacts' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderActivity() }
        { this.renderEdit() }

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

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.contact.pictureUrl} />
      </div>
    )
  }

  renderActivityText() {
    // if(this.props.contact.active)
    //   return "actif"
    // else
    //   return "inactif"
  }

  renderOrganizations() {
    return _.map(this.props.contact.organizations, (organization) => {
      return (
        <Link to={'/organizations/' + organization.id} key={organization.id}>
          {organization.name}
        </Link>
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
    return (
      <div className="col-md-4">
        <h3>Email</h3>

        <span title={this.props.contact.email}>
          {this.props.contact.email}
        </span>
      </div>
    )
  }
}

module.exports = GeneralShow
