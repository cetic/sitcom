import ProjectDates   from '../shared/project_dates.es6'
import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className="general">
        <Link to={'/projects' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderEdit() }

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>
          <div className="col-md-8">
            <h1>
              { this.props.project.name }
            </h1>

            <ProjectDates project={this.props.project} />
          </div>
        </div>

        <div className="row row-contact-infos">
          {this.props.project.description}
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

  renderPicture() {
    return (
      <CustomDropzone url={this.props.projectPath}
                      afterSuccess={this.props.reloadFromBackend}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.project.pictureUrl} />
      </CustomDropzone>
    )
  }
}

module.exports = GeneralShow
