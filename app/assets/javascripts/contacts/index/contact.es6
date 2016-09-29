import FlipCard from 'react-flipcard/flip_card.es6'

class Contact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: this.props.contact.selected
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.contact.selected != this.props.contact.selected) {
      this.setState({ selected: newProps.contact.selected })
    }
  }

  toggleSelected() {
    this.setState({ selected: !this.state.selected }, () => {
      this.props.updateSelected(this.props.contact, this.state.selected) // propagate to list
    })
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8) // remove '/options'
  }

  removeTag(tag) {
    if(confirm('Voulez-vous vraiment supprimer le tag ' + tag.name + ' ?')) {
      http.delete(this.tagsPath() + '/' + tag.id, {
        contact_id: this.props.contact.id
      })
    }
  }

  pushTagIdsFilter(tag) {
    this.props.pushTagIdsFilter(tag.id)
  }

  pushFieldIdsFilter(field) {
    this.props.pushFieldIdsFilter(field.id)
  }

  render() {
    return (
      <div className="contact item">
        { this.renderPicture() }
        { this.renderActivity() }
        { this.renderSocial() }

        <div className="infos">
          <span className="name">
            <Link to={'/contacts/' + this.props.contact.id + this.props.search}>{this.props.contact.name}</Link>
          </span>

          <span className="links">
            { this.renderOrganizations() }
          </span>

          <span className="associations">
            { this.renderProjects() }
            { this.renderEvents() }
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
          <img className="img-thumbnail front" src={this.props.contact.thumbPictureUrl} onClick={this.toggleSelected.bind(this)} />
          <span onClick={this.toggleSelected.bind(this)}>
            <img className="img-thumbnail back" src={this.props.contact.thumbPictureUrl} />
            <i className="fa fa-check"></i>
          </span>
        </FlipCard>
      </div>
    )
  }

  renderActivity() {
    var activityClass = 'activity'
    activityClass     += this.props.contact.active ? ' active' : ''

    return (
      <div className={activityClass}>
        <div className="activity-inside">&nbsp;
        </div>
      </div>
    )
  }

  renderSocial() {
    var facebook = this.props.contact.facebookUrl != '' ? <i className="fa fa-facebook-square"></i> : ''
    var linkedin = this.props.contact.linkedinUrl != '' ? <i className="fa fa-linkedin-square"></i> : ''
    var twitter  = this.props.contact.twitterUrl  != '' ? <i className="fa fa-twitter-square"></i>  : ''

    return (
      <div className="social">
        <a href={this.props.contact.facebookUrl} target="_blank">{ facebook }</a>
        <a href={this.props.contact.linkedinUrl} target="_blank">{ linkedin }</a>
        <a href={this.props.contact.twitterUrl}  target="_blank">{ twitter }</a>
      </div>
    )
  }

  renderOrganizations() {
    return _.map(this.props.contact.organizations, (organization, i) => {
      return (
        <span key={organization.id}>
          <Link to={'/organizations/' + organization.id}>
            { organization.name }
          </Link>
          { this.props.contact.organizations.length - 1 == i ? '' : ', '}
        </span>
      )
    })
  }

  renderTagsContainer() {
    return (
      <ul className="tags">
        { this.renderFields() }
        { this.renderTags() }
      </ul>
    )
  }

  renderFields() {
    var sortedFields = _.sortBy(this.props.contact.fields, 'name')

    return _.map(sortedFields, (field) => {
      return (
        <li className="field label label-default"
            key={field.id}
            style={{ cursor: 'pointer' }}
            onClick={this.pushFieldIdsFilter.bind(this, field)}>
          { field.name }
        </li>
      )
    })
  }

  renderTags() {
    // reverse because css float right
    var sortedTags = _.reverse(_.sortBy(this.props.contact.tags, 'name'))

    return _.map(sortedTags, (tag) => {
      return (
        <li className="tag label label-default"
            key={tag.id}
            style={{ backgroundColor: tag.color, cursor: 'pointer' }}>
          { this.renderDelete(tag) }
          <span onClick={this.pushTagIdsFilter.bind(this, tag)}>
            { tag.name }
          </span>
        </li>
      )
    })
  }

  renderDelete(tag) {
    var iconClass = 'fa fa-times'
    iconClass += this.props.permissions.canWriteContacts ? '' : 'not-visible'

    return (
      <i className={iconClass}
         onClick={this.removeTag.bind(this, tag)}></i>
    )
  }

  renderProjects() {
    var l = this.props.contact.projects.length

    if(l) {
      return (
        <a className="association projects"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'projet' : 'projets' }
        </a>
      )
    }
  }

  renderEvents() {
    var l = this.props.contact.events.length

    if(l) {
      return (
        <a className="association events"
           href="javascript:;">
          <em>{ l }</em> { l == 1 ? 'évènement' : 'évènements' }
        </a>
      )
    }
  }
}

module.exports = Contact
