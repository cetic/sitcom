import LinkRole from '../link_role.es6'

class Item extends React.Component {

  remove() {
    this.props.removeItem(this.props.itemLink[this.props.itemType])
  }

  render() {
    const item = this.props.itemLink[this.props.itemType]

    return (
      <div className="col-md-6 association item" key={item.id}>
        <div className="association-inside">
          <img className="img-thumbnail" src={item.thumbPictureUrl} />
          <h4>
            <Link to={item.scopedPath}>{item.name}</Link>
          </h4>

          {this.renderRole()}
          {this.renderRemoveIcon()}
          {this.renderDates(item)}
          {this.renderContactsCount(item)}
        </div>
      </div>
    )
  }

  renderRole() {
    return (
      <LinkRole link={this.props.itemLink}
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

  renderDates(item) {
    if(this.props.fieldName == 'projectIds') {
      return (
        <span className="dates">{item.startDate} &rarr; {item.endDate}</span>
      )
    }

    if(this.props.fieldName == 'eventIds') {
      return (
        <span className="dates">{item.happensOn}</span>
      )
    }
  }

  renderContactsCount(item) {
    if(item.contactIds) {
      return (
        <div className="members">
          <i className="fa fa-group"></i>
          {item.contactIds.length}
        </div>
      )
    }
  }

}

module.exports = Item
