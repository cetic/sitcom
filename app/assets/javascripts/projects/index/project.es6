class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="project">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/' + this.props.project.id + this.props.search}>{this.props.project.name}</Link>
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
        <img className="img-thumbnail" src={this.props.project.previewPictureUrl} />
      </div>
    )
  }

  renderContacts() {
    return _.map(this.props.project.contacts, (contact) => {
      return contact.name
    }).join(', ')
  }

}

module.exports = Project
