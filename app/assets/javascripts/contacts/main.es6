import BaseMain       from '../shared/base/base_main.es6'
import Contacts       from './index/contacts.es6'
import Contact        from './show/contact.es6'
import NewContact     from './shared/new_contact.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import SavedSearches  from '../shared/saved_searches.es6'
import QuickSearch    from '../shared/quick_search.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.title              = 'Contacts'
    this.itemType           = 'contact'
    this.newButtonLabel     = 'Nouveau contact'
    this.SavedSearches      = SavedSearches
    this.AdvancedSearch     = AdvancedSearch
    this.exportUrl          = `${this.props.route.contactsPath}/export`
    this.mailchimpExportUrl = `${this.props.route.contactsPath}/mailchimp_export`

    this.state = {
      items:           [],
      filteredItemIds: [],
      filteredCount:   0,
      selectedItemIds: [],
      selectedCount:   0,
      loaded:          false,
    }
  }

  getFilters() {
    var customFieldFilters = {}

    _.each(this.props.route.contactCustomFields, (customField) => {
      customFieldFilters[`customField${customField.id}`] = this.props.location.query[`customField${customField.id}`] || ''
    })

    return Object.assign(customFieldFilters, {
      quickSearch:     this.props.location.query.quickSearch      || '',
      name:            this.props.location.query.name             || '',
      email:           this.props.location.query.email            || '',
      address:         this.props.location.query.address          || '',
      phone:           this.props.location.query.phone            || '',
      notes:           this.props.location.query.notes            || '',
      active:          this.props.location.query.active           || '',
      organizationIds: this.props.location.query.organizationIds,
      projectIds:      this.props.location.query.projectIds,
      eventIds:        this.props.location.query.eventIds,
      fieldIds:        this.props.location.query.fieldIds,
      tagIds:          this.props.location.query.tagIds,
    })
  }

  updateSelected(item, newValue) {
    if(newValue == false && _.includes(this.state.selectedItemIds, item.id)) {
      this.setState({
        selectedItemIds: _.filter(this.state.selectedItemIds, (itemId) => { return itemId != item.id }),
        selectedCount:   this.state.selectedCount - 1,
      })
    }
    else if(newValue == true && !_.includes(this.state.selectedItemIds, item.id)) {
      this.setState({
        selectedItemIds: this.state.selectedItemIds.concat([item.id]),
        selectedCount:   this.state.selectedCount + 1,
      })
    }
  }

  unselectAllItems() {
    this.setState({
      selectedItemIds: [],
      selectedCount:   0,
    })
  }

  // @overrides
  renderQuickSearch(filters) {
    return (
      <QuickSearch title={this.title}
                   loaded={this.state.loaded}
                   results={this.state.filteredCount}
                   selectedCount={this.state.selectedCount}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)}
                   filters={filters}
                   exportUrl={this.exportUrl}
                   mailchimpExportUrl={this.mailchimpExportUrl}
                   selectedItemIds={this.state.selectedItemIds}
                   tagOptionsPath={this.props.route.tagOptionsPath}
                   unselectAllContacts={this.unselectAllItems.bind(this)}
                   isMailchimpConfigured={this.props.route.isMailchimpConfigured} />
    )
  }

  renderItems() {
    return (
      <Contacts permissions={this.props.route.permissions}
                contacts={this.filteredItems()}
                selectedItemIds={this.state.selectedItemIds}
                loaded={this.state.loaded}
                search={this.props.location.search}
                tagOptionsPath={this.props.route.tagOptionsPath}
                loadingImagePath={this.props.route.loadingImagePath}
                updateSelected={this.updateSelected.bind(this)}
                pushTagIdsFilter={this.pushIdsListFilter.bind(this, 'tagIds')}
                pushFieldIdsFilter={this.pushIdsListFilter.bind(this, 'fieldIds')} />
    )
  }

  renderItem() {
    var urlItemId = parseInt(this.props.params.id)
    var item      = _.find(this.state.items, (item) => { return item.id == urlItemId })

    return (
      <Contact id={urlItemId}
               contact={item}
               permissions={this.props.route.permissions}
               currentUserId={this.props.route.currentUserId}
               labId={this.props.route.labId}
               loaded={this.state.loaded}
               contactsPath={this.props.route.contactsPath}
               search={this.props.location.search}
               loadingImagePath={this.props.route.loadingImagePath}
               tagOptionsPath={this.props.route.tagOptionsPath}
               fieldOptionsPath={this.props.route.fieldOptionsPath}
               organizationOptionsPath={this.props.route.organizationOptionsPath}
               projectOptionsPath={this.props.route.projectOptionsPath}
               eventOptionsPath={this.props.route.eventOptionsPath}
               contacts={this.filteredItems()}
               router={this.props.router} />
    )
  }

  renderNewModal() {
    return (
      <NewContact contactsPath={this.props.route.contactsPath}
                  router={this.props.router} />
    )
  }
}

module.exports = Main
