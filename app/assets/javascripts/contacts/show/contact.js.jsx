class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contact: {},
      loaded:  false
    };
  }

  componentDidMount() {
    this.reloadFromBackend()
  }

  contactPath() {
    return this.props.contactsPath + '/' + this.props.id
  }

  reloadFromBackend() {
    $.get(this.contactPath(), (data) => {
      var camelData = humps.camelizeKeys(data)

      console.log(camelData)

      this.setState({
        contact: camelData,
        loaded: true
      })
    });
  }

  render() {
    return (
      <div className="contact">
        { this.renderLoading() }
        { this.renderGeneral() }
      </div>
    )
  }

  renderLoading() {
    if(!this.state.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
  }

  renderGeneral() {
    if(this.state.loaded) {
      return (
        <div className="general">
          <Link to={'/' + this.props.search} className="back">
            Retour
          </Link>

          { this.renderGeneralPicture() }

          { this.state.contact.name }
          { this.renderGeneralOrganizations() }
          { this.renderGeneralFields() }

          <div className="row">
            { this.renderGeneralAddress() }
            { this.renderGeneralPhone() }
            { this.renderGeneralEmail() }
          </div>
        </div>
      );
    }
  }

  renderGeneralPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.state.contact.pictureUrl} />
      </div>
    )
  }

  renderGeneralOrganizations() {
    return _.map(this.state.contact.organizations, (organization) => {
      return organization.name
    }).join(', ')
  }

  renderGeneralFields() {
    return _.map(this.state.contact.fields, (field) => {
      return (
        <li className="field" key={ field.id }>
          <span className="label label-default">{ field.name }</span>
        </li>
      )
    })
  }

  renderGeneralAddress() {
    return (
      <div className="col-md-4">
        <h3>Adresse</h3>
      </div>
    )
  }

  renderGeneralPhone() {
    return (
      <div className="col-md-4">
        <h3>Téléphone</h3>
      </div>
    )
  }

  renderGeneralEmail() {
    return (
      <div className="col-md-4">
        <h3>Email</h3>
      </div>
    )
  }
}

module.exports = Contact
