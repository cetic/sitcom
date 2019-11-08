import ProjectDates   from '../shared/project_dates.jsx'
import CustomDropzone from '../../shared/custom_dropzone.jsx'
import Tags           from '../../shared/tags.jsx'

export default class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyProject() {
    if(confirm("Supprimer ce projet ?")) {
      http.delete(this.props.projectPath)
      this.props.router.replace('projects' + this.props.search)
    }
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8); // remove '/options'
  }

  render() {
    return (
      <div className="general">
        <Link to={'/projects' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-sm-3 col-xs-4">
            { this.renderPicture() }
          </div>
          <div className="col-sm-9">
            <h1>
              { this.props.project.name }
            </h1>

            <div className="dates">
              <ProjectDates startDate={this.props.project.startDate}
                            endDate={this.props.project.endDate} />
            </div>

            <div style={{ clear: 'both' }}></div>

            { this.renderTags() }

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
                      clickable={['.general .img-thumbnail', '.general .update-image']}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.project.previewPictureUrl} />
      </CustomDropzone>
    )
  }

  renderTags() {
    return (
      <Tags canWriteItems={this.props.permissions.canWriteProjects}
            itemType="project"
            itemTags={this.props.project.tags}
            itemId={this.props.project.id}
            itemPath={this.props.projectPath}
            tagsPath={this.tagsPath()}
            tagOptionsPath={this.props.tagOptionsPath} />
    )
  }
}
