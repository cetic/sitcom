class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="contact item">
        { this.renderPicture() }
        { this.renderActivity() }
        { this.renderSocial() }

        <div className="infos">
          <span className="name">
            <Link to={'/contacts/' + this.props.contact.id + this.props.search}>{this.props.contact.name}</Link>
          </span>

          <span className="links">
            { this.renderOrganizations() }
          </span>

          <span className="associations">
            { this.renderEvents() }
            { this.renderProjects() }
          </span>

          { this.renderFieldsContainer() }
        </div>

        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.contact.thumbPictureUrl} />
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
    return _.map(this.props.contact.organizations, (organization, i) => {
      return (
        <span key={organization.id}>
          <Link to={'/organizations/' + organization.id}>
            { organization.name }
          </Link>
          { this.props.contact.organizations.length - 1 == i ? '' : ', '}
        </span>
      )
    })
  }

  renderFieldsContainer() {
    if(this.props.contact.fields.length)
      return (
        <ul className="fields">
          { this.renderFields() }
        </ul>
      )
  }

  renderFields() {
    return _.map(this.props.contact.fields, (field) => {
      return (
        <li className="field" key={ field.id }>
          <span className="label label-default">{ field.name }</span>
        </li>
      )
    })
  }

  renderEvents() {
    var l = this.props.contact.events.length

    if(l) {
      return (
        <a className="association events"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'évènement' : 'évènements' }
        </a>
      )
    }
  }

  renderProjects() {
    var l = this.props.contact.projects.length

    if(l) {
      return (
        <a className="association projects"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'projet' : 'projets' }
        </a>
      )
    }
  }
}

module.exports = Contact
