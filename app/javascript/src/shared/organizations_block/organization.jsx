import LinkRole from '../link_role.jsx'

export default class Organization extends React.Component {

  remove() {
    this.props.removeOrganization(this.props.organizationLink.organization)
  }

  render() {
    return (
      <div className="col-md-6 association organization">
        {this.renderInside()}
      </div>
    )
  }

  renderInside() {
    const organization = this.props.organizationLink.organization

    return (
      <div className="association-inside">
        <img className="img-thumbnail" src={organization.thumbPictureUrl} />
        <h4>
          <Link to={organization.scopedPath}>
            {organization.name}
          </Link>
        </h4>

        {this.renderRole()}
        {this.renderRemoveIcon()}
      </div>
    )
  }

  renderRole() {
    return (
      <LinkRole link={this.props.organizationLink}
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
