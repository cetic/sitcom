import LinkRole from '../link_role.es6'

class Contact extends React.Component {

  remove() {
    this.props.removeContact(this.props.contactLink.contact)
  }

  render() {
    return (
      <div className="col-md-6 association contact">
        {this.renderInside()}
      </div>
    )
  }

  renderInside() {
    const contact = this.props.contactLink.contact

    return (
      <div className="association-inside">
        <img className="img-thumbnail" src={contact.thumbPictureUrl} />
        <h4>
          <Link to={contact.scopedPath}>{contact.name}</Link>
        </h4>

        {this.renderRole()}
        {this.renderRemoveIcon()}
      </div>
    )
  }

  renderRole() {
    return (
      <LinkRole link={this.props.contactLink}
                linkName={this.props.linkName}
                canWrite={this.props.canWrite} />
    )
  }

  renderRemoveIcon() {
    if(this.props.canWrite) {
      return (
        <i className="fa fa-times remove-icon"
          onClick={this.remove.bind(this)}>
        </i>
      )
    }
  }

}

module.exports = Contact
