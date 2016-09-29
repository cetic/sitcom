import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyOrganization() {
    if(confirm("Supprimer cette organisation ?")) {
      http.delete(this.props.organizationPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('organizations'  + this.props.search)
        }
      })
    }
  }

  render() {
    return (
      <div className="general">
        <Link to={'/organizations' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-8">
            <h1>
              { this.props.organization.name }
            </h1>

            { this.renderWebsite() }

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
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.organization.previewPictureUrl} />
      </CustomDropzone>
    )
  }
}

module.exports = GeneralShow
