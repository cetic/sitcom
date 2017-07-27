import ExportButton          from '../shared/export_button.es6'
import MailchimpExportButton from './quick_search/mailchimp_export_button.es6'
import TagsSelector          from './tags_selector.es6'

class QuickSearch extends React.Component {

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

  render() {
    return (
      <div className="quick-search row">
        <Link to={`/${this.props.itemType}s`}>
          <span className="title">
            { this.props.title }
          </span>
        </Link>

        <input ref="search"
               type="search"
               className="form-control"
               placeholder="Recherche rapide"
               value={this.props.quickSearch}
               onChange={this.updateQuickSearch.bind(this)} />

        <i className="glyphicon glyphicon-search"></i>

        {this.renderResetIcon()}
        {this.renderResults()}
        {this.renderExportButton()}
        {this.renderMailchimpExportButton()}
        {this.renderTags()}
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
        <ExportButton selectedIds={this.props.selectedItemIds}
                      filters={this.props.filters}
                      exportUrl={this.props.exportUrl} />
      )
    }
  }

  renderMailchimpExportButton() {
    if(this.props.isMailchimpConfigured && this.props.results != 0 && this.props.loaded) {
      return (
        <MailchimpExportButton selectedIds={this.props.selectedItemIds}
                               filters={this.props.filters}
                               mailchimpExportUrl={this.props.mailchimpExportUrl} />
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
        <TagsSelector itemType={this.props.itemType}
                      tagOptionsPath={this.props.tagOptionsPath}
                      selectedItemIds={this.props.selectedItemIds}
                      unselectAllItems={this.props.unselectAllItems} />
      )
    }
  }
}

module.exports = QuickSearch
