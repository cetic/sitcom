import ProjectDates from '../shared/project_dates.es6'

class Project extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
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
            { this.renderOrganizations() }
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
        <img className="img-thumbnail" src={this.props.project.thumbPictureUrl} />
      </div>
    )
  }

  renderContacts() {
    var l = this.props.project.contactLinks.length

    if(l) {
      return (
        <a className="association contacts"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'contact' : 'contacts' }
        </a>
      )
    }
  }

  renderOrganizations() {
    var l = this.props.project.organizationLinks.length

    if(l) {
      return (
        <a className="association organizations"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'organisation' : 'organisations' }
        </a>
      )
    }
  }
}

module.exports = Project
