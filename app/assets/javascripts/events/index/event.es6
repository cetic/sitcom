import EventDate from '../shared/event_date.es6'

class Event extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="event item">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/events/' + this.props.event.id + this.props.search}>{this.props.event.name}</Link>
          </span>

          <span className="associations">
            { this.renderContacts() }
            { this.renderOrganizations() }
          </span>

          <br/>

          <span className="date">
            <EventDate event={this.props.event} />
          </span>

          <span className="place">
            {this.props.event.place}
          </span>
        </div>

        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.event.thumbPictureUrl} />
      </div>
    )
  }

  renderContacts() {
    var l = this.props.event.contactLinks.length

    if(l) {
      return (
        <a className="association contactLinks"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'contact' : 'contacts' }
        </a>
      )
    }
  }

  renderOrganizations() {
    var l = this.props.event.organizationLinks.length

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

module.exports = Event
