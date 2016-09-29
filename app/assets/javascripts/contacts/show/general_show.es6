import CustomDropzone from '../../shared/custom_dropzone.es6'
import Tags           from '../../shared/tags.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyContact() {
    if(confirm("Supprimer ce contact ?")) {
      http.delete(this.props.contactPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('contacts' + this.props.search)
        }
      })
    }
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8); // remove '/options'
  }

  render() {
    return (
      <div className="general">
        <Link to={'/contacts' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-8">
            <h1>
              { this.props.contact.name }

              <span className="activity-text">
                { this.renderActivityText() }
              </span>
            </h1>

            <ul className="fields">
              { this.renderFields() }
            </ul>

            { this.renderTags() }
          </div>
        </div>

        <div className="row row-contact-infos">
          { this.renderAddress() }
          { this.renderPhone() }
          { this.renderEmail() }
        </div>

        { this.renderButtons() }
      </div>
    )
  }

  renderButtons() {
    return (
      <div className="btn-group">
        <button type="button"
                className="btn btn-primary"
                onClick={this.props.toggleEditMode}>
          Modifier
        </button>
        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <a href="javascript:;"
               onClick={this.destroyContact.bind(this)}>
              Supprimer
            </a>
          </li>
        </ul>
      </div>
    )
  }

  renderEdit() {
    if(this.props.permissions.canWriteContacts) {
      return(
        <button className="btn btn-secondary btn-edit"
                onClick={this.props.toggleEditMode}>
          Modifier
        </button>
      )
    }
  }

  renderDestroy() {
    if(this.props.permissions.canWriteContacts) {
      return(
        <button className="btn btn-secondary btn-delete"
                onClick={this.destroyContact.bind(this)}>
          &times;
        </button>
      )
    }
  }

  renderPicture() {
    return (
      <CustomDropzone url={this.props.contactPath}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.contact.previewPictureUrl} />
      </CustomDropzone>
    )
  }

  renderActivityText() {
    if(this.props.contact.active)
      return "actif"
    else
      return "inactif"
  }

  renderFields() {
    var sortedFields = _.sortBy(this.props.contact.fields, 'name')

    return _.map(sortedFields, (field) => {
      return (
        <li className="field label label-default"
            key={ field.id }>
          { field.name }
        </li>
      )
    })
  }

  renderTags() {
    return (
      <Tags permissions={this.props.permissions}
            contactTags={this.props.contact.tags}
            contactId={this.props.contact.id}
            contactPath={this.props.contactPath}
            tagsPath={this.tagsPath()}
            tagOptionsPath={this.props.tagOptionsPath} />
    )
  }

  renderAddress() {
    var address = () => {
      if(this.props.contact.address == '')
        return <em>non-renseignée</em>
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
        return <em>non-renseigné</em>
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
        return <em>non-renseigné</em>
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
