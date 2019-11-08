import enhanceWithClickOutside from 'react-click-outside'

class TagsSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tags:               [],
      tagSelectionOpened: false,
    }
  }

  componentDidMount() {
    this.reloadTags()
  }

  reloadTags() {
    http.get(this.props.tagOptionsPath, {
      itemType: _.capitalize(this.props.itemType)
    }, (data) => {
      this.setState({
        tags: data,
      })
    })
  }

  toggleTagSelection() {
    this.setState({ tagSelectionOpened: !this.state.tagSelectionOpened }, () => {
      $(this.refs.newTagInput).focus()
    })
  }

  handleClickOutside() {
    this.setState({ tagSelectionOpened: false });
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8); // remove '/options'
  }

  addTagFromInput(e) {
    if(e.keyCode == 13) { // enter
      this.setState({ tagSelectionOpened: false })

      http.post(this.tagsPath(), {
        name:     e.target.value,
        itemIds:  this.props.selectedItemIds,
        itemType: _.capitalize(this.props.itemType)
      }, (data) => {
        // this.reloadTags() => will already be remounted next time an item is selected
        this.props.unselectAllItems()
      })
    }
  }

  addTag(tag) {
    this.setState({ tagSelectionOpened: false })

    http.post(this.tagsPath(), {
      name:     tag.label,
      itemIds:  this.props.selectedItemIds,
      itemType: _.capitalize(this.props.itemType)
    }, (data) => {
      // this.reloadTags() => will already be remounted next time an item is selected
      this.props.unselectAllItems()
    })
  }

  render() {
    return (
      <div className="tags">
        <span onClick={ this.toggleTagSelection.bind(this) }>
          Tags
          <i className="fa fa-gear"></i>
        </span>

        { this.renderTagSelection() }
      </div>
    )
  }

  renderTagSelection() {
    if(this.state.tagSelectionOpened) {
      return (
        <ul className="tags-menu">
          { this.renderTagSelectionItems() }
          <li>
            <input type="text"
                   placeholder="Créer un nouveau tag"
                   ref="newTagInput"
                   onKeyDown={this.addTagFromInput.bind(this)} />
          </li>
        </ul>
      )
    }
  }

  renderTagSelectionItems() {
    return _.map(this.state.tags, (tag, index) => {
      var darkerColor  = window.shadeColor(-0.30, tag.color)
      var lighterColor = window.shadeColor( 0.85, tag.color)

      return (
        <li key={index}
            className="tag-item"
            style={{ backgroundColor: lighterColor }}
            onClick={this.addTag.bind(this, tag)}>
          <i className="fa fa-check" style={{ color: darkerColor }}></i>
          <span className="color"
                style={{ backgroundColor: tag.color }}>
          </span>
          <span className="name"
                style={{ color: darkerColor }}
                title={tag.label}>
            { tag.label }
          </span>
          <div style={{ clear: 'both' }}></div>
        </li>
      )
    })
  }
}

export default enhanceWithClickOutside(TagsSelector)
