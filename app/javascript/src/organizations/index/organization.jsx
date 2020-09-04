import FlipCard from '../../libraries/react-flipcard/flip_card.jsx'

export default class Organization extends React.Component {
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
      this.props.updateSelected(this.props.organization, this.state.selected) // propagate to list
    })
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8) // remove '/options'
  }

  removeTag(tag) {
    if(confirm('Voulez-vous vraiment supprimer le tag ' + tag.name + ' ?')) {
      http.delete(this.tagsPath() + '/' + tag.id, {
        itemId:   this.props.organization.id,
        itemType: 'Organization'
      })
    }
  }

  pushTagIdsFilter(tag) {
    this.props.pushTagIdsFilter(tag.id)
  }

  render() {
    return (
      <div className="organization item">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/organizations/' + this.props.organization.id + this.props.search}>{this.props.organization.name}</Link>
          </span>

          <span className="associations">
            { this.renderContacts() }
            { this.renderProjects() }
            { this.renderEvents()   }
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
          <img className="img-thumbnail front" src={this.props.organization.thumbPictureUrl} onClick={this.toggleSelected.bind(this)} />
          <span onClick={this.toggleSelected.bind(this)}>
            <img className="img-thumbnail back" src={this.props.organization.thumbPictureUrl} />
            <i className="fa fa-check"></i>
          </span>
        </FlipCard>
      </div>
    )
  }

  renderContacts() {
    var l = this.props.organization.contactLinks.length

    if(l) {
      return (
        <a className="association contacts">
          <em>{ l }</em> { l == 1 ? 'contact' : 'contacts' }
        </a>
      )
    }
  }

  renderProjects() {
    var l = this.props.organization.projectLinks.length

    if(l) {
      return (
        <a className="association projects">
          <em>{ l }</em> { l == 1 ? 'projet' : 'projets' }
        </a>
      )
    }
  }

  renderEvents() {
    var l = this.props.organization.eventLinks.length

    if(l) {
      return (
        <a className="association events">
          <em>{ l }</em> { l == 1 ? 'évènement' : 'évènements' }
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
    var sortedTags = _.reverse(_.sortBy(this.props.organization.tags, 'name'))

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
    iconClass += this.props.permissions.canWriteOrganizations ? '' : ' not-visible'

    return (
      <i className={iconClass}
         onClick={this.removeTag.bind(this, tag)}></i>
    )
  }
}
