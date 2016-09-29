import ParamsService from '../params_service.es6'
import QuickSearch   from '../quick_search.es6'

class BaseMain extends React.Component {

  constructor(props) {
    super(props)

    this.onStorageItemCreated   = this.onStorageItemCreated.bind(this)
    this.onStorageItemUpdated   = this.onStorageItemUpdated.bind(this)
    this.onStorageItemDestroyed = this.onStorageItemDestroyed.bind(this)
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300)
  }

  componentDidMount() {
    if(this.storageExists())
      this.reloadFromStorage()
    else
      this.reloadFromBackend()

    this.selectHeaderMenu()
    this.bindStorageListeners()
  }

  componentWillUnmount() {
    this.unbindStorageListeners()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.location.search != this.props.location.search) {
      this.dReloadFromBackend()
    }
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

  storageExists() {
    return this.props.storage.getItem(`${this.itemType}s`) != undefined
  }

  onStorageItemCreated() {
    console.log(`${this.itemType}-created`)
    setTimeout(() => {
      this.reloadFromBackend(this.itemType)
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
      selectedCount: 0
    }
    newState[`${this.itemType}s`] = storedItems

    this.setState(newState)
  }

  reloadFromBackend(spinner = true) {
    const itemsPath = this.props.route[`${this.itemType}sPath`]

    if(spinner) {
      this.setState({ loaded: false })
    }

    http.get(itemsPath, this.getFilters(), (data) => {
      var newState = {
        loaded:        true,
        selectedCount: 0
      }
      newState[`${this.itemType}s`] = data[`${this.itemType}s`]

      this.setState(newState, () => {
        // Push item in persistent storage (only if no active filter!)
        if(this.props.location.search == '' || this.props.location.search == '?') {
          this.props.storage.setItem(`${this.itemType}s`, data[`${this.itemType}s`])
        }
      })
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
