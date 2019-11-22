import CustomDropzone from '../../shared/custom_dropzone.jsx'
import Tags           from '../../shared/tags.jsx'

export default class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyOrganization() {
    if(confirm("Supprimer cette organisation ?")) {
      http.delete(this.props.organizationPath)
      this.props.router.replace('organizations'  + this.props.search)
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
            </h1>

            { this.renderWebsite() }

            { this.renderTags() }

            <div className="description">
              {this.props.organization.description}
            </div>
          </div>
        </div>

        { this.renderButtons() }
      </div>
    )
  }

  renderWebsite() {
    if(this.props.organization.websiteUrl != '') {
      return (
        <div className="website">
          <a href={this.props.organization.websiteUrl}
             target="_blank">
            { this.props.organization.websiteUrl }
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
             src={this.props.organization.previewPictureUrl}
             style={{ minHeight: this.props.previewPictureUrl ? 'inherit' : '150px' }} />
      </CustomDropzone>
    )
  }
}
