import ProjectDates   from '../shared/project_dates.es6'
import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyProject() {
    if(confirm("Supprimer ce projet ?")) {
      http.delete(this.props.projectPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('projects' + this.props.search)
        }
      })
    }
  }

  render() {
    return (
      <div className="general">
        <Link to={'/projects' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>
          <div className="col-md-8">
            <h1>
              { this.props.project.name }
            </h1>

            <div className="dates">
              <ProjectDates project={this.props.project} />
            </div>

            <div style={{ clear: 'both' }}></div>

            <div className="description">
              {this.props.project.description}
            </div>
          </div>
        </div>

        { this.renderButtons() }
      </div>
    )
  }

  renderButtons() {
    if(this.props.permissions.canWriteProjects) {
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
                 onClick={this.destroyProject.bind(this)}>
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
      <CustomDropzone url={this.props.projectPath}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.project.previewPictureUrl} />
      </CustomDropzone>
    )
  }
}

module.exports = GeneralShow
