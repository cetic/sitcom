class Organization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="organization item">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/organizations/' + this.props.organization.id + this.props.search}>{this.props.organization.name}</Link>
          </span>

          <span className="links">
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
        <img className="img-thumbnail" src={this.props.organization.thumbPictureUrl} />
      </div>
    )
  }

  renderContacts() {
    return _.map(this.props.organization.contacts, (contact, i) => {
      return (
        <span key={contact.id}>
          <Link to={'/contacts/' + contact.id}>
            { contact.name }
          </Link>
          { this.props.organization.contacts.length - 1 == i ? '' : ', '}
        </span>
      )
    })
  }
}

module.exports = Organization
