import enhanceWithClickOutside from 'react-click-outside'

class TagsSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tags:   [],
      opened: false,
    }
  }

  componentDidMount() {
    this.reloadTags()
  }

  reloadTags() {
    http.get(this.props.tagOptionsPath, {}, (data) => {
      this.setState({
        tags: data,
      })
    })
  }

  toggleOpened() {
    this.setState({ opened: !this.state.opened }, () => {
      $(this.refs.newTagInput).focus()
    })
  }

  handleClickOutside() {
    this.setState({ opened: false });
  }

  toggleTag(tag) {
    var selected = _.includes(this.selectedTagLabels(), tag.label)

    if(selected) {
      this.removeTag(tag)
    }
    else {
      this.addTag(tag)
    }
  }

  addTagFromInput(e) {
    if(e.keyCode == 13) { // enter
      http.post(this.props.tagsPath, {
        name:        e.target.value,
        contact_ids: [this.props.contactId]
      }, (data) => {
        $(this.refs.newTagInput).val('')
        $(this.refs.newTagInput).focus()
        this.reloadTags()

        if(this.props.onChange) {
          this.props.onChange()
        }
      })
    }
  }

  addTag(tag) {
    http.post(this.props.tagsPath, {
      name:        tag.label,
      contact_ids: [this.props.contactId]
    }, (data) => {
      // don't reload tags here because it already exists if we were able to add it

      if(this.props.onChange) {
        this.props.onChange()
      }
    })
  }

  removeTag(tag) {
    http.delete(this.props.tagsPath + '/' + tag.value, {
      contact_id: this.props.contactId
    }, (data) => {
      this.reloadTags()

      if(this.props.onChange) {
        this.props.onChange()
      }
    })
  }

  selectedTagLabels() {
    return _.map(this.props.contactTags, 'name')
  }

  render() {
    return (
      <ul className="tags">
        { this.renderTags() }
        { this.renderNewTag() }
      </ul>
    )
  }

  renderTags() {
    var sortedTags = _.sortBy(this.props.contactTags, 'name')

    return _.map(sortedTags, (tag) => {
      return (
        <li className="tag label label-default"
            onClick={this.toggleOpened.bind(this)}
            key={ tag.id }
            style={{ backgroundColor: tag.color }}>
          { tag.name }
        </li>
      )
    })
  }

  renderNewTag() {
    if(this.props.permissions.canWriteContacts) {
      return (
        <li className="tag label label-default last">
          <div className="new-tag">
            <span onClick={this.toggleOpened.bind(this)}>
              <i className="fa fa-plus"></i>
              { this.renderPlusName() }
            </span>

            { this.renderTagSelection() }
          </div>
        </li>
      )
    }
  }

  renderPlusName() {
    return this.props.contactTags.length ? '' : ' Groupe'
  }

  renderTagSelection() {
    if(this.state.opened) {
      return (
        <ul className="tags-menu">
          { this.renderTagSelectionItems() }
          <li>
            <input type="text"
                   placeholder="Create new group"
                   ref="newTagInput"
                   onKeyDown={this.addTagFromInput.bind(this)} />
          </li>
        </ul>
      )
    }
  }

  renderTagSelectionItems() {
    return _.map(this.state.tags, (tag, index) => {
      var selected = _.includes(this.selectedTagLabels(), tag.label)

      var darkerColor  = selected ? window.shadeColor(-0.30, tag.color) : undefined
      var lighterColor = selected ? window.shadeColor( 0.85, tag.color) : undefined

      var classCheck  = 'fa fa-check'
      var classRemove = 'fa fa-remove'

      classCheck  += selected ? '' : ' not-visible'
      classRemove += selected ? '' : ' not-visible'

      return (
        <li key={index}
            className="tag-item"
            style={{ backgroundColor: lighterColor }}
            onClick={this.toggleTag.bind(this, tag)}>
          <i className={classCheck} style={{ color: darkerColor }}></i>
          <span className="color"
                style={{ backgroundColor: tag.color }}>
          </span>
          <span className="name"
                style={{ color: darkerColor }}
                title={tag.label}>
            { tag.label }
          </span>
          <i className={classRemove} style={{ color: darkerColor }}></i>
          <div style={{ clear: 'both' }}></div>
        </li>
      )
    })
  }
}

module.exports = enhanceWithClickOutside(TagsSelector)
