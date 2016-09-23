import BaseMain         from '../shared/base/base_main.es6'
import Organizations    from './index/organizations.es6'
import Organization     from './show/organization.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import SavedSearches    from '../shared/saved_searches.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.itemType       = 'organization'
    this.newButtonLabel = 'Nouvelle organisation'

    this.state = {
      organizations: [],
      loaded:        false,
    }
  }

  getFilters() {
    return {
      quickSearch:  this.props.location.query.quickSearch || '',
      name:         this.props.location.query.name        || '',
      status:       this.props.location.query.status      || '',
      description:  this.props.location.query.description || '',
      websiteUrl:   this.props.location.query.websiteUrl  || '',
      notes:        this.props.location.query.notes       || '',
      contactIds:   this.props.location.query.contactIds,
    }
  }

  renderSavedSearches() {
    return(
      <SavedSearches router={this.props.router}
                     search={this.props.location.search}
                     itemType="organization"
                     savedSearchesPath={`${this.props.organizationsPath}/saved_searches`} />
    )
  }

  renderAdvancedSearch(filters) {
    return (
      <AdvancedSearch filters={filters}
                      updateFilters={this.updateFilters.bind(this)}
                      contactOptionsPath={this.props.contactOptionsPath}
                      organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath} />
    )
  }

  renderQuickSearch(filters) {
    return (
      <QuickSearch title="Organisations"
                   loaded={this.state.loaded}
                   results={this.state.organizations.length}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)}
                   filters={filters}
                   exportUrl={this.props.organizationsPath + '/export'} />
    )
  }

  renderItems() {
    return (
      <Organizations organizations={this.state.organizations}
                     loaded={this.state.loaded}
                     search={this.props.location.search}
                     loadingImagePath={this.props.loadingImagePath} />
    )
  }

  renderItem() {
    return (
      <Organization id={this.props.params.id}
                    permissions={this.props.permissions}
                    loaded={this.state.loaded}
                    organizationsPath={this.props.organizationsPath}
                    search={this.props.location.search}
                    loadingImagePath={this.props.loadingImagePath}
                    contactOptionsPath={this.props.contactOptionsPath}
                    reloadIndexFromBackend={this.reloadFromBackend.bind(this)}
                    organizations={this.state.organizations}
                    router={this.props.router} />
    )
  }

  renderNewModal() {
    return (
      <NewItem reloadFromBackend={this.reloadFromBackend.bind(this)}
               itemsPath={this.props.contactsPath}
               router={this.props.router}
               modalClassName="new-organization-modal"
               modalTitle="Nouvelle organisation"
               modelName="organization"
               fieldName="name"
               fieldTitle="Nom" />
    )
  }
}

module.exports = Main
