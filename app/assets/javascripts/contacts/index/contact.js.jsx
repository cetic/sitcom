class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="contact">
        { this.renderPicture() }
        { this.renderActivity() }
        { this.renderSocial() }

        <div className="infos">
          <span className="name">
            <Link to={'/' + this.props.contact.id + this.props.search}>{this.props.contact.name}</Link>
          </span>

          <span className="organizations">
            { this.renderOrganizations() }
          </span>
        </div>

        <ul className="fields">
          { this.renderFields() }
        </ul>

        <div style={{ clear: 'both' }}></div>

        <div className="events-and-projects">
          { this.renderEvents() }
          { this.renderProjects() }
        </div>

        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.contact.pictureUrl} />
      </div>
    )
  }

  renderActivity() {
    var activityClass = 'activity'
    activityClass     += this.props.contact.active ? ' active' : ''

    return (
      <div className={activityClass}>
        <div className="activity-inside">&nbsp;
        </div>
      </div>
    )
  }

  renderSocial() {
    var facebook = this.props.contact.facebookUrl != '' ? <i className="fa fa-facebook-square"></i> : '';
    var linkedin = this.props.contact.linkedinUrl != '' ? <i className="fa fa-linkedin-square"></i> : '';
    var twitter  = this.props.contact.twitterUrl  != '' ? <i className="fa fa-twitter-square"></i>  : '';

    return (
      <div className="social">
        <a href={this.props.contact.facebookUrl} target="_blank">{ facebook }</a>
        <a href={this.props.contact.linkedinUrl} target="_blank">{ linkedin }</a>
        <a href={this.props.contact.twitterUrl}  target="_blank">{ twitter }</a>
      </div>
    )
  }

  renderOrganizations() {
    return _.map(this.props.contact.organizations, (organization) => {
      return organization.name
    }).join(', ')
  }

  renderFields() {
    return _.map(this.props.contact.fields, (field) => {
      return (
        <li className="field" key={ field.id}>
          <span className="label label-default">{ field.name }</span>
        </li>
      )
    })
  }

  renderEvents() {
    return (
      <div className="events">
        { this.props.contact.events.length } événements <i className="fa fa-caret-down"></i>
      </div>
    )
  }

  renderProjects() {
    return (
      <div className="projects">
        { this.props.contact.projects.length } projets <i className="fa fa-caret-down"></i>
      </div>
    )
  }
}

module.exports = Contact
