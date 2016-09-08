import ProjectDates from '../shared/project_dates.es6'

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="project item">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/projects/' + this.props.project.id + this.props.search}>{this.props.project.name}</Link>
          </span>

          <span className="associations">
            { this.renderContacts() }
          </span>

          <span className="dates">
            <ProjectDates project={this.props.project} />
          </span>
        </div>

        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.project.previewPictureUrl} />
      </div>
    )
  }

  renderContacts() {
    var l = this.props.project.contacts.length

    if(l) {
      return (
        <a className="association contacts"
           href="javascript:;">
          { l } { l == 1 ? 'participant' : 'participants' }
        </a>
      )
    }
  }
}

module.exports = Project
