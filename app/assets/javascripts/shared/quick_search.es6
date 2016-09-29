import ExportButton from '../shared/export_button.es6'
import TagsSelector from './tags_selector.es6'

class QuickSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    $(this.refs.search).focus()
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

  selectedContacts() {
    return _.filter(this.props.contacts, 'selected');
  }

  selectedContactIds() {
    return _.map(this.selectedContacts(), 'id')
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
        <TagsSelector tagOptionsPath={this.props.tagOptionsPath}
                      selectedContactIds={this.selectedContactIds.bind(this)} />
      )
    }
  }
}

module.exports = QuickSearch
