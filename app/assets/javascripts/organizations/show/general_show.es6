import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  destroyOrganization() {
    if(confirm("Supprimer cette organisation ?")) {
      http.delete(this.props.organizationPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('organizations')
          setTimeout(this.props.reloadIndexFromBackend, 1500)
        }
      });
    }
  }

  render() {
    return (
      <div className="general">
        <Link to={'/organizations' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderEdit() }
        { this.renderDestroy() }

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-8">
            <h1>
              { this.props.organization.name }
            </h1>
          </div>
        </div>

        <div className="row row-contact-infos">
          {this.props.organization.description}
        </div>
      </div>
    );
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
      <button className="btn btn-secondary btn-delete"
              onClick={this.destroyOrganization.bind(this)}>
        &times;
      </button>
    )
  }

  renderPicture() {
    return (
      <CustomDropzone url={this.props.organizationPath}
                      afterSuccess={this.props.reloadFromBackend}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.organization.previewPictureUrl} />
      </CustomDropzone>
    )
  }
}

module.exports = GeneralShow
