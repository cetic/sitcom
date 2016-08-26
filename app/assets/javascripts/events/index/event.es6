class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="event">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/events/' + this.props.event.id + this.props.search}>{this.props.event.name}</Link>
          </span>

          <span className="dates">
            { this.renderDate() }
          </span>

          <span className="contacts">
            { this.renderContacts() }
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

  renderDate() {
    if(this.props.event.happensOn) {
      return (
        <div>{moment(this.props.event.happensOn).format('DD/MM/YYYY')}</div>
      )
    }
  }

  renderContacts() {
    return _.map(this.props.event.contacts, (contact) => {
      return contact.name
    }).join(', ')
  }

}

module.exports = Event
