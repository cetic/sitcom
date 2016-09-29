import ParamsService from '../params_service.es6'
import QuickSearch   from '../quick_search.es6'

class BaseMain extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.onStorageItemCreated   = this.onStorageItemCreated.bind(this)
    this.onStorageItemUpdated   = this.onStorageItemUpdated.bind(this)
    this.onStorageItemDestroyed = this.onStorageItemDestroyed.bind(this)

    this.dReloadIdsFromBackend = _.debounce(this.reloadIdsFromBackend, 300)
  }

  componentDidMount() {
    if(this.storageExists()) {
      this.reloadFromStorage()
    }
    else {
      this.reloadAllFromBackend(true, () => {
        if(this.hasFilters()) {
          this.reloadIdsFromBackend()
        }
      })
    }

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

  storageExists() {
    return this.props.storage.getItem(`${this.itemType}s`) != undefined
  }

  onStorageItemCreated() {
    console.log(`${this.itemType}-created`)
    setTimeout(() => {
      this.reloadAllFromBackend()
    }, window.backendRefreshDelay) // waiting for indexation, but not in a hurry
  }

  onStorageItemUpdated() {
    console.log(`${this.itemType}-updated`)
    var newState = {}
    newState[`${this.itemType}s`] = this.props.storage.getItem(`${this.itemType}s`)
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

    var newState = {
      loaded:        true,
      selectedCount: 0,
      filteredCount: storedItems.length
    }
    newState[`${this.itemType}s`] = storedItems
    newState[`filtered${_.upperFirst(this.itemType)}Ids`] = _.map(storedItems, 'id')

    this.setState(newState)
  }

  reloadAllFromBackend(spinner = true, callback = undefined) {
    if(spinner) {
      this.setState({ loaded: false })
    }

    const itemsPath = this.props.route[`${this.itemType}sPath`]

    http.get(itemsPath, {}, (data) => {
      var newState = {
        loaded:        true,
        selectedCount: 0,
        filteredCount: data[`${this.itemType}s`].length
      }
      newState[`${this.itemType}s`] = data[`${this.itemType}s`]
      newState[`filtered${_.upperFirst(this.itemType)}Ids`] = _.map(data[`${this.itemType}s`], 'id')

      this.setState(newState, () => {
        this.props.storage.setItem(`${this.itemType}s`, data[`${this.itemType}s`])

        if(callback) {
          callback()
        }
      })
    })
  }

  reloadIdsFromBackend(spinner = true) {
    if(spinner) {
      this.setState({ loaded: false })
    }

    const itemsPath = this.props.route[`${this.itemType}sPath`]
    var   query = _.assign({}, { onlyIds: true }, this.getFilters())

    http.get(itemsPath, query, (data) => {
      var newState = {
        loaded:        true,
        selectedCount: 0,
        filteredCount: data[`${this.itemType}Ids`].length
      }

      newState[`filtered${_.upperFirst(this.itemType)}Ids`] = data[`${this.itemType}Ids`]

      this.setState(newState)
    })
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

  render() {
    const canRead = this.props.route.permissions[`canRead${_.upperFirst(this.itemType)}s`]

    if(canRead) {
      var filters = this.getFilters()

      return (
        <div className={`container-fluid container-${this.itemType}`}>
          <div className="row">
            {this.renderRightSidebar(filters)}

            <div className={`col-md-8 col-${this.itemType}s`}>
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
    return (
      <this.AdvancedSearch filters={filters}
                           updateFilters={this.updateFilters.bind(this)}
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
                   results={this.state[`${this.itemType}s`].length}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)}
                   filters={filters}
                   exportUrl={this.exportUrl} />
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
      return (
        <button className="btn btn-primary new"
                onClick={this.openNewModal.bind(this)}>
          {this.newButtonLabel}
        </button>
      )
    }
  }

}

module.exports = BaseMain
