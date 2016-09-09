import EventDate from '../shared/event_date.es6'

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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
        <img className="img-thumbnail" src={this.props.event.previewPictureUrl} />
      </div>
    )
  }

  renderContacts() {
    var l = this.props.event.contacts.length

    if(l) {
      return (
        <a className="association contacts"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'participant' : 'participants' }
        </a>
      )
    }
  }
}

module.exports = Event
