import FlipCard  from 'react-flipcard/flip_card.es6'
import EventDate from '../shared/event_date.es6'

class Event extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: this.props.selected
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.selected != this.state.selected) {
      this.setState({ selected: newProps.selected })
    }
  }

  toggleSelected() {
    this.setState({ selected: !this.state.selected }, () => {
      this.props.updateSelected(this.props.event, this.state.selected) // propagate to list
    })
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8) // remove '/options'
  }

  removeTag(tag) {
    if(confirm('Voulez-vous vraiment supprimer le tag ' + tag.name + ' ?')) {
      http.delete(this.tagsPath() + '/' + tag.id, {
        eventId: this.props.event.id
      })
    }
  }

  pushTagIdsFilter(tag) {
    this.props.pushTagIdsFilter(tag.id)
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

          { this.renderTagsContainer() }
        </div>

        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }

  renderPicture() {
    return (
      <div className="picture">
        <FlipCard disabled={true}
                  flipped={this.state.selected}>
          <img className="img-thumbnail front" src={this.props.event.thumbPictureUrl} onClick={this.toggleSelected.bind(this)} />
          <span onClick={this.toggleSelected.bind(this)}>
            <img className="img-thumbnail back" src={this.props.event.thumbPictureUrl} />
            <i className="fa fa-check"></i>
          </span>
        </FlipCard>
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

  renderTagsContainer() {
    return (
      <ul className="tags">
        { this.renderTags() }
      </ul>
    )
  }

  renderTags() {
    // reverse because css float right
    var sortedTags = _.reverse(_.sortBy(this.props.event.tags, 'name'))

    return _.map(sortedTags, (tag) => {
      return (
        <li className="tag label label-default"
            key={tag.id}
            style={{ backgroundColor: tag.color, cursor: 'pointer' }}>
          { this.renderDeleteTag(tag) }
          <span onClick={this.pushTagIdsFilter.bind(this, tag)}>
            { tag.name }
          </span>
        </li>
      )
    })
  }

  renderDeleteTag(tag) {
    var iconClass = 'fa fa-times'
    iconClass += this.props.permissions.canWriteEvents ? '' : ' not-visible'

    return (
      <i className={iconClass}
         onClick={this.removeTag.bind(this, tag)}></i>
    )
  }
}

module.exports = Event
