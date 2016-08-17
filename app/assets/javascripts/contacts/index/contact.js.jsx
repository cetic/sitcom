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
            <Link to={'/' + this.props.contact.id}>{this.props.contact.name}</Link>
          </span>

          <span className="companies">
            { _.map(this.props.contact.organizations, (organization) => { organization.name }).join(', ') }
          </span>
        </div>

        <ul className="skills">
          <li className="skill"><span className="label label-default">Développement</span></li>
          <li className="skill"><span className="label label-default">Développement web</span></li>
          <li className="skill"><span className="label label-default">Développement mobile</span></li>
        </ul>

        <div style={{ clear: 'both' }}></div>

        <div className="events">
          <div className="event">
            7 événements <i className="fa fa-caret-down"></i>
          </div>
          <div className="event">
            3 projets <i className="fa fa-caret-down"></i>
          </div>
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
    return (
      <div className="activity">
        <div className="activity-inside">&nbsp;
        </div>
      </div>
    )
  }

  renderSocial() {
    var facebook = this.props.contact.facebookUrl != '' ? <i className="fa fa-facebook-square"></i> : '';
    var linkedin = this.props.contact.linkedinUrl != '' ? <i className="fa fa-linkedin-square"></i> : '';
    var twitter  = this.props.contact.twitterUrl  != '' ? <i className="fa fa-twitter-square"></i> : '';

    return (
      <div className="social">
        { facebook }
        { linkedin }
        { twitter }
      </div>
    )
  }
}

module.exports = Contact
