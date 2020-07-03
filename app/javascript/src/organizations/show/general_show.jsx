import CustomDropzone from '../../shared/custom_dropzone.jsx'
import Tags           from '../../shared/tags.jsx'

export default class GeneralShow extends React.Component {

  destroyOrganization() {
    if(confirm("Supprimer cette organisation ?")) {
      http.delete(this.props.organizationPath)
      this.props.router.replace('organizations'  + this.props.search)
    }
  }

  removePicture() {
    if(confirm("Supprimer cette photo ?")) {
      http.put(this.props.organizationPath, { picture: '' })
    }
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8); // remove '/options'
  }

  render() {
    return (
      <div className="general">
        <Link to={'/organizations' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-sm-3 col-xs-4">
            { this.renderPicture() }
          </div>

          <div className="col-sm-9">
            <h1>
              { this.props.organization.name }
              <em className="status">{ this.props.organization.status }</em>
              <em className="status">{ this.props.organization.companyNumber }</em>
            </h1>

            { this.renderWebsite() }

            { this.renderTags() }

            <div className="description">
              {this.props.organization.description}
            </div>
          </div>
        </div>

        <div className="row row-contact-infos">
          { this.renderAddress() }
        </div>

        { this.renderButtons() }
      </div>
    )
  }

  renderWebsite() {
    if(this.props.organization.websiteUrl != '') {
      let strippedUrl = this.props.organization.websiteUrl
      strippedUrl = _.replace(strippedUrl, 'https://', '')
      strippedUrl = _.replace(strippedUrl, 'http://', '')

      return (
        <div className="website">
          <a href={this.props.organization.websiteUrl}
             target="_blank">
            { strippedUrl }
          </a>
        </div>
      )
    }
  }

  renderTags() {
    return (
      <Tags canWriteItems={this.props.permissions.canWriteOrganizations}
            itemType="organization"
            itemTags={this.props.organization.tags}
            itemId={this.props.organization.id}
            itemPath={this.props.organizationPath}
            tagsPath={this.tagsPath()}
            tagOptionsPath={this.props.tagOptionsPath} />
    )
  }

  renderButtons() {
    if(this.props.permissions.canWriteOrganizations) {
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
                 onClick={this.destroyOrganization.bind(this)}>
                Supprimer
              </a>
            </li>
          </ul>
        </div>
      )
    }
  }

  renderPicture() {
    return (
      <CustomDropzone url={this.props.organizationPath}
                      clickable={['.general .img-thumbnail', '.general .update-image']}
                      acceptedFiles="image/*">
        <img className="img-thumbnail"
             src={this.props.organization.previewPictureUrl} />
        { this.renderRemovePicture() }
      </CustomDropzone>
    )
  }

  renderRemovePicture() {
    if(!this.props.organization.previewPictureUrl.includes('https://')) {
      return (
        <i className="fa fa-times"
           onClick={this.removePicture.bind(this)}>
        </i>
      )
    }
  }

  renderAddress() {
    const addressParts = [
      this.props.organization.address1,
      this.props.organization.address2,
      this.props.organization.zip,
      this.props.organization.city,
      this.props.organization.country
    ]

    let addressHTML = _.join(
      _.filter(addressParts, (p) => { return !_.isEmpty(p) })
      , '<br />')

    if(_.isEmpty(addressHTML)) addressHTML = "<em>non-renseignée</em>"

    return (
      <div className="col-md-4">
        <h3>Adresse</h3>

        <div dangerouslySetInnerHTML={{ __html: addressHTML }} />
      </div>
    )
  }

}
