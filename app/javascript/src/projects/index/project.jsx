import FlipCard     from '../../libraries/react-flipcard/flip_card.jsx'
import ProjectDates from '../shared/project_dates.jsx'

export default class Project extends React.Component {
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
      this.props.updateSelected(this.props.project, this.state.selected) // propagate to list
    })
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8) // remove '/options'
  }

  removeTag(tag) {
    if(confirm('Voulez-vous vraiment supprimer le tag ' + tag.name + ' ?')) {
      http.delete(this.tagsPath() + '/' + tag.id, {
        itemId:   this.props.project.id,
        itemType: 'Project'
      })
    }
  }

  pushTagIdsFilter(tag) {
    this.props.pushTagIdsFilter(tag.id)
  }

  render() {
    return (
      <div className="project item">
        { this.renderPicture() }

        <div className="infos">
          <span className="name">
            <Link to={'/projects/' + this.props.project.id + this.props.search}>{this.props.project.name}</Link>
          </span>

          <span className="associations">
            { this.renderContacts() }
            { this.renderOrganizations() }
            { this.renderEvents() }
          </span>

          <span className="dates">
            <ProjectDates startDate={this.props.project.startDate}
                          endDate={this.props.project.endDate} />
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
          <img className="img-thumbnail front" src={this.props.project.thumbPictureUrl} onClick={this.toggleSelected.bind(this)} />
          <span onClick={this.toggleSelected.bind(this)}>
            <img className="img-thumbnail back" src={this.props.project.thumbPictureUrl} />
            <i className="fa fa-check"></i>
          </span>
        </FlipCard>
      </div>
    )
  }

  renderContacts() {
    var l = this.props.project.contactLinks.length

    if(l) {
      return (
        <a className="association contacts">
          <em>{ l }</em> { l == 1 ? 'contact' : 'contacts' }
        </a>
      )
    }
  }

  renderOrganizations() {
    var l = this.props.project.organizationLinks.length

    if(l) {
      return (
        <a className="association organizations">
          <em>{ l }</em> { l == 1 ? 'organisation' : 'organisations' }
        </a>
      )
    }
  }

  renderEvents() {
    var l = this.props.project.eventLinks.length

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
    var sortedTags = _.reverse(_.sortBy(this.props.project.tags, 'name'))

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
    iconClass += this.props.permissions.canWriteProjects ? '' : ' not-visible'

    return (
      <i className={iconClass}
         onClick={this.removeTag.bind(this, tag)}></i>
    )
  }
}
