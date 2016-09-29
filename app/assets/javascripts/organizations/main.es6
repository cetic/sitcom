import BaseMain       from '../shared/base/base_main.es6'
import Organizations  from './index/organizations.es6'
import Organization   from './show/organization.es6'
import NewItem        from '../shared/new_item.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import SavedSearches  from '../shared/saved_searches.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.title          = 'Organisations'
    this.itemType       = 'organization'
    this.newButtonLabel = 'Nouvelle organisation'
    this.SavedSearches  = SavedSearches
    this.AdvancedSearch = AdvancedSearch
    this.exportUrl      = `${this.props.route.organizationsPath}/export`

    this.state = {
      organizations: [],
      loaded:        false,
    }
  }

  getFilters() {
    return {
      quickSearch: this.props.location.query.quickSearch || '',
      name:        this.props.location.query.name        || '',
      status:      this.props.location.query.status      || '',
      description: this.props.location.query.description || '',
      websiteUrl:  this.props.location.query.websiteUrl  || '',
      notes:       this.props.location.query.notes       || '',
      contactIds:  this.props.location.query.contactIds,
    }
  }

  renderItems() {
    return (
      <Organizations organizations={this.state.organizations}
                     loaded={this.state.loaded}
                     search={this.props.location.search}
                     loadingImagePath={this.props.route.loadingImagePath} />
    )
  }

  renderItem() {
    var urlOrganizationId = parseInt(this.props.params.id)
    var organization      = _.find(this.state.organizations, (organization) => { return organization.id == urlOrganizationId } )

    return (
      <Organization id={urlOrganizationId}
                    organization={organization}
                    permissions={this.props.route.permissions}
                    currentUserId={this.props.route.currentUserId}
                    labId={this.props.route.labId}
                    loaded={this.state.loaded}
                    organizationsPath={this.props.route.organizationsPath}
                    search={this.props.location.search}
                    loadingImagePath={this.props.route.loadingImagePath}
                    contactOptionsPath={this.props.route.contactOptionsPath}
                    organizations={this.state.organizations}
                    router={this.props.router} />
    )
  }

  renderNewModal() {
    return (
      <NewItem itemsPath={this.props.route.contactsPath}
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
