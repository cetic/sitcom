import ParamsService    from '../params_service.jsx'
import QuickSearch      from '../quick_search.jsx'
import PermissionDenied from '../../shared/permission_denied.jsx'

export default class BaseMain extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.onStorageItemCreated   = this.onStorageItemCreated.bind(this)
    this.onStorageItemUpdated   = this.onStorageItemUpdated.bind(this)
    this.onStorageItemDestroyed = this.onStorageItemDestroyed.bind(this)

    this.dReloadIdsFromBackend = _.debounce(this.reloadIdsFromBackend, 300)

    if(this.storageExists()) {
      this.reloadFromStorage()
    }
    else {
      this.reloadAllFromBackend(true, () => {
        this.reloadIdsFromBackend()
      })
    }
  }

  componentDidMount() {
    this.selectHeaderMenu()
    this.bindStorageListeners()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.location.search != this.props.location.search) {
      this.dReloadIdsFromBackend()
    }
  }

  componentWillUnmount() {
    this.unbindStorageListeners()
  }

  bindStorageListeners() {
    this.props.storage.ee.addListener(`${this.itemType}-created`,   this.onStorageItemCreated)
    this.props.storage.ee.addListener(`${this.itemType}-updated`,   this.onStorageItemUpdated)
    this.props.storage.ee.addListener(`${this.itemType}-destroyed`, this.onStorageItemDestroyed)
  }

  unbindStorageListeners() {
    this.props.storage.ee.removeListener(`${this.itemType}-created`,   this.onStorageItemCreated)
    this.props.storage.ee.removeListener(`${this.itemType}-updated`,   this.onStorageItemUpdated)
    this.props.storage.ee.removeListener(`${this.itemType}-destroyed`, this.onStorageItemDestroyed)
  }

  hasFilters() {
    return this.props.location.search != '' && this.props.location.search != '?'
  }

  filteredItems() {
    if(this.hasFilters()) {
      return _.filter(this.state.items, (item) => {
        return _.includes(this.state.filteredItemIds, item.id)
      })
    }
    else {
      return this.state.items
    }
  }

  storageExists() {
    return this.props.storage.getItem(`${this.itemType}s`) != undefined
  }

  onStorageItemCreated() {
    console.log(`${this.itemType}-created`)
    setTimeout(() => {
      this.reloadAllFromBackend(false)
    }, window.backendRefreshDelay) // waiting for indexation, but not in a hurry
  }

  onStorageItemUpdated() {
    console.log(`${this.itemType}-updated`)
    var newState = {}
    newState['items'] = this.props.storage.getItem(`${this.itemType}s`)
    this.setState(newState)
  }

  onStorageItemDestroyed() {
    console.log(`${this.itemType}-destroyed`)
    this.onStorageItemUpdated()
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $(`.nav.sections li.${this.itemType}s`).addClass('selected')
  }

  openNewModal() {
    $(`.new-${this.itemType}-modal`).modal('show')
  }

  reloadFromStorage() {
    var storedItems = this.props.storage.getItem(`${this.itemType}s`)

    this.setState({
      items:           storedItems,
      filteredItemIds: _.map(storedItems, 'id'),
      filteredCount:   storedItems.length,
      selectedItemIds: [],
      selectedCount:   0,
      loaded:          true,
    })
  }

  reloadAllFromBackend(spinner = true, callback = undefined) {
    if(spinner) {
      this.setState({ loaded: false })
    }

    const itemsPath = this.props.route[`${this.itemType}sPath`]

    http.get(itemsPath + '.json', {}, (data) => {
      var items = data[`${this.itemType}s`]

      this.setState({
        items:           items,
        filteredItemIds: _.map(items, 'id'),
        filteredCount:   items.length,
        //selectedItemIds: [], => keep selected items
        //selectedCount:   0,  => keep selected items
        loaded:          true,
      }, () => {
        this.props.storage.setItem(`${this.itemType}s`, items)

        if(callback) {
          callback()
        }
      })
    })
  }

  reloadIdsFromBackend(spinner = true) {
    if(this.hasFilters()) {
      if(spinner) {
        this.setState({ loaded: false })
      }

      const itemsPath = this.props.route[`${this.itemType}sPath`]
      var   query     = _.assign({}, { onlyIds: true }, this.getFilters())

      http.get(itemsPath + '.json', query, (data) => {
        this.setState({
          filteredItemIds: data[`${this.itemType}Ids`],
          filteredCount:   data[`${this.itemType}Ids`].length,
          selectedItemIds: [],
          selectedCount:   0,
          loaded:          true,
        })
      })
    }
    else {
      this.setState({
        filteredItemIds: _.map(this.state.items, 'id'),
        filteredCount:   this.state.items.length,
        selectedItemIds: [],
        selectedCount:   0,
        loaded:          true,
      })
    }
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues)
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push(`${this.itemType}s?${paramsString}`)
  }

  replaceUrl(newValues) {
    var paramsString = ParamsService.rejectEmptyParams($.param(newValues))
    this.props.router.push(`${this.itemType}s?${paramsString}`)
  }

  updateQuickSearch(newQuickSearch) {
    this.updateFilters({
      quickSearch: newQuickSearch
    })
  }

  updateFilters(newFilters) {
    this.updateUrl(newFilters)
  }

  replaceFilters(newFilters) {
    this.replaceUrl(newFilters)
  }

  pushIdsListFilter(field, newId) {
    var filters = this.getFilters()
    var newFilters    = {}
    newFilters[field] = [newId].join(',')

    this.replaceFilters(newFilters)
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

  render() {
    const canRead = this.props.route.permissions[`canRead${_.upperFirst(this.itemType)}s`]

    if(canRead) {
      var filters = this.getFilters()

      return (
        <div className={`container-fluid container-${this.itemType}`}>
          <div className="row">
            {this.renderRightSidebar(filters)}

            <div className={`col-lg-8 col-md-12 col-${this.itemType}s`}>
              {this.renderQuickSearch(filters)}
              {this.renderNewButton()}
              {this.renderItemOrItems()}
            </div>
          </div>

          { this.renderNewModal() }
        </div>
      )
    }
    else {
      return (
        <PermissionDenied />
      )
    }
  }

  renderRightSidebar(filters) {
    return (
      <div className="col-md-4 pull-right right-sidebar">
        {this.renderSavedSearches()}
        {this.renderAdvancedSearch(filters)}
      </div>
    )
  }

  renderSavedSearches() {
    const pathPrefix        = this.props.route[`${this.itemType}sPath`]
    const savedSearchesPath = `${pathPrefix}/saved_searches`

    return(
      <this.SavedSearches router={this.props.router}
                          search={this.props.location.search}
                          itemType={this.itemType}
                          savedSearchesPath={savedSearchesPath} />
    )
  }

  renderAdvancedSearch(filters) {
    const customFields = this.props.route[`${this.itemType}CustomFields`]

    return (
      <this.AdvancedSearch filters={filters}
                           updateFilters={this.updateFilters.bind(this)}
                           customFields={customFields}
                           tagOptionsPath={this.props.route.tagOptionsPath}
                           fieldOptionsPath={this.props.route.fieldOptionsPath}
                           contactOptionsPath={this.props.route.contactOptionsPath}
                           organizationOptionsPath={this.props.route.organizationOptionsPath}
                           projectOptionsPath={this.props.route.projectOptionsPath}
                           eventOptionsPath={this.props.route.eventOptionsPath}
                           organizationStatusesOptionsPath={this.props.route.organizationStatusesOptionsPath} />
    )
  }

  renderQuickSearch(filters) {
    return (
      <QuickSearch title={this.title}
                   loaded={this.state.loaded}
                   results={this.state.filteredCount}
                   selectedCount={this.state.selectedCount}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)}
                   filters={filters}
                   itemType={this.itemType}
                   exportUrl={this.exportUrl}
                   mailchimpExportUrl={this.mailchimpExportUrl}
                   selectedItemIds={this.state.selectedItemIds}
                   tagOptionsPath={this.props.route.tagOptionsPath}
                   unselectAllItems={this.unselectAllItems.bind(this)}
                   isMailchimpConfigured={this.props.route.isMailchimpConfigured} />
    )
  }

  renderItemOrItems() {
    if(this.props.params.id) {
      return this.renderItem()
    }
    else {
      return this.renderItems()
    }
  }

  renderNewButton() {
    if(this.props.route.permissions[`canWrite${_.upperFirst(this.itemType)}s`]) {
      const importPath = `${this.props.location.basename}/item_imports/new?item_type=${this.itemType}`

      return (
        <div className="btn-group new">
          <button type="button"
                  className="btn btn-primary"
                  onClick={this.openNewModal.bind(this)}>
            {this.newButtonLabel}
          </button>

          <button type="button"
                  className="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
            <span className="caret"></span>
          </button>

          <ul className="dropdown-menu">
            <li>
              <a href={importPath}>Importer un XLSX</a>
            </li>
          </ul>
        </div>
      )
    }
  }

}
