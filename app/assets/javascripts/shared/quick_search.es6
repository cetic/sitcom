import enhanceWithClickOutside from 'react-click-outside'
import ExportButton            from '../shared/export_button.es6'

class QuickSearch extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tags:               [],
      tagSelectionOpened: false,
    }
  }

  componentDidMount() {
    $(this.refs.search).focus()
    this.reloadTags()
  }

  reloadTags() {
    http.get(this.props.tagOptionsPath, {}, (data) => {
      this.setState({
        tags: data,
      })
    })
  }

  updateQuickSearch(e) {
    this.props.updateQuickSearch(e.target.value)
  }

  resetQuickSearch() {
    this.props.updateQuickSearch('')
  }

  singularItemName() {
    var singularItemName = this.props.title.substring(0, this.props.title.length - 1)
    return singularItemName.toLowerCase()
  }

  singularFound() {
    var name = this.singularItemName()
    return name == 'organisation' ? 'trouvée' : 'trouvé'
  }

  pluralFound() {
    var name = this.singularItemName() + 's'
    return name == 'organisations' ? 'trouvées' : 'trouvés'
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

  selectedContacts() {
    return _.filter(this.props.contacts, 'selected');
  }

  selectedContactIds() {
    return _.map(this.selectedContacts(), 'id')
  }

  addTagFromInput(e) {
    if(e.keyCode == 13) { // enter
      this.setState({ tagSelectionOpened: false })

      http.post(this.tagsPath(), {
        name:        e.target.value,
        contact_ids: this.selectedContactIds()
      }, (data) => {
        setTimeout(() => {
          this.props.reloadIndexFromBackend(false)
          this.reloadTags()
        }, window.backendRefreshDelay)
      })
    }
  }

  addTag(tag) {
    this.setState({ tagSelectionOpened: false })

    http.post(this.tagsPath(), {
      name:        tag.label,
      contact_ids: this.selectedContactIds()
    }, (data) => {
      setTimeout(() => this.props.reloadIndexFromBackend(false), window.backendRefreshDelay)
    })
  }

  render() {
    return (
      <div className="quick-search row">
        <span className="title">
          { this.props.title }
        </span>

        <input ref="search"
               type="search"
               className="form-control"
               placeholder="Recherche rapide"
               value={this.props.quickSearch}
               onChange={this.updateQuickSearch.bind(this)} />

        <i className="glyphicon glyphicon-search"></i>

        { this.renderResetIcon() }
        { this.renderResults() }
        { this.renderExportButton() }
        { this.renderTags() }
      </div>
    )
  }

  renderResetIcon() {
    if(this.props.quickSearch.length) {
      return (
        <i className="fa fa-times" onClick={this.resetQuickSearch.bind(this)}></i>
      )
    }
  }

  renderExportButton() {
    if(this.props.results != 0 && this.props.loaded) {
      return (
        <ExportButton selectedIds={this.selectedContactIds.bind(this)}
                      filters={this.props.filters}
                      exportUrl={this.props.exportUrl} />
      )
    }
  }

  renderResults() {
    if(this.props.results != 0 && this.props.loaded) {
      if(this.props.selectedCount > 0) {
        return (
          <span className="results">
            { this.props.selectedCount == 1 ? this.props.selectedCount + ' ' + this.singularItemName() + ' sélectionné' : this.props.selectedCount + ' ' + this.singularItemName() + 's sélectionnés' }
          </span>
        )
      }
      else if(this.props.quickSearch == '') {
        return (
          <span className="results">
            { this.props.results == 1 ? this.props.results + ' ' + this.singularItemName() : this.props.results + ' ' + this.singularItemName() + 's' }
          </span>
        )
      }
      else {
        return (
          <span className="results">
            { this.props.results == 1 ? this.props.results + ' ' + this.singularItemName() + ' ' + this.singularFound() : this.props.results + ' ' + this.singularItemName() + 's ' + this.pluralFound() }
          </span>
        )
      }
    }
  }

  renderTags() {
    if(this.props.selectedCount > 0 && this.props.loaded) {
      return (
        <div className="tags">
          <span onClick={ this.toggleTagSelection.bind(this) }>
            Groupes
            <i className="fa fa-gear"></i>
          </span>

          { this.renderTagSelection() }
        </div>
      )
    }
  }

  renderTagSelection() {
    if(this.state.tagSelectionOpened) {
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

module.exports = enhanceWithClickOutside(QuickSearch)
