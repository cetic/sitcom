class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="contact">
        <div className="picture">
          <img className="img-thumbnail" src="//gravatar.com/avatar/06bd08d55ba6eb514afba6eab21af2af.png?s=34&d=retro" />
        </div>

        <div className="activity">
          <div className="activity-inside">&nbsp;
          </div>
        </div>

        <div className="social">
          <i className="fa fa-facebook-square"></i>
          <i className="fa fa-linkedin-square"></i>
          <i className="fa fa-twitter-square"></i>
        </div>

        <div className="infos">
          <span className="name">
            {this.props.contact.name}
          </span>

          <span className="companies">
            80LIMIT SPRL
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
}

module.exports = Contact
