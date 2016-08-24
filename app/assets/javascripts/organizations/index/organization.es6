class Organization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="organization">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/' + this.props.organization.id + this.props.search}>{this.props.organization.name}</Link>
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
        <img className="img-thumbnail" src={this.props.organization.pictureUrl} />
      </div>
    )
  }

  renderContacts() {
    return _.map(this.props.organization.contacts, (contact) => {
      return contact.name
    }).join(', ')
  }

}

module.exports = Organization
