import ParamsService from '../params_service.es6'
import QuickSearch   from '../quick_search.es6'

class BaseMain extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300)
  }

  componentDidMount() {
    if(this.shouldUseLocalStorage()) {
      this.reloadFromLocalStorage()
    }
    else {
      this.reloadFromBackend()
    }

    this.bindCable()
    this.selectHeaderMenu()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.location.search != this.props.location.search) {
      this.dReloadFromBackend()
    }
  }

  bindCable() {
    App.cable.subscriptions.create({ channel: `${_.upperFirst(this.itemType)}sChannel`, lab_id: this.props.route.labId }, {
      received: (data) => {
        var camelData = humps.camelizeKeys(data)
        var itemId    = camelData.action == 'destroy' ? camelData.itemId : camelData.item.id

        if(camelData.action == 'create') {
          setTimeout(() => {
            this.reloadFromBackend(false)
          }, window.backendRefreshDelay) // waiting for indexation, but not in a hurry
        }
        else if(camelData.action == 'update') {
          var newItems = this.state[`${this.itemType}s`]
          var index       = _.findIndex(newItems, (item) => { return itemId == item.id })
          var wasSelected = newItems[index].selected
          newItems[index] = camelData.item
          newItems[index].selected = wasSelected // to keep selection when updated (only useful for contacts for now)

          var newState = {}
          newState[`${this.itemType}s`] = newItems
          this.setState(newState)
        }
        else if(camelData.action == 'destroy') {
          var newState = {}
          newState[`${this.itemType}s`] = _.filter(this.state[`${this.itemType}s`], (item) => { return itemId != item.id })
          this.setState(newState)
        }
      }
    })
  }

  shouldUseLocalStorage() {
    var emptyFilters      = this.isEmptyFilters()
    var existingStorage   = localStorage.getItem(`${this.itemType}s`)
    var storageNotExpired = localStorage.getItem(`${this.itemType}s-lastSync`) && Date.now() - parseInt(localStorage.getItem(`${this.itemType}s-lastSync`)) < 0 //5 * 60 * 1000 // 5 minutes

    return emptyFilters && existingStorage && storageNotExpired
  }

  getListFromLocalStorage() {
    return JSON.parse(localStorage.getItem(`${this.itemType}s`))
  }

  setListToLocalStorage() {
    localStorage.setItem(`${this.itemType}s`, JSON.stringify(this.state[`${this.itemType}s`]))
    localStorage.setItem(`${this.itemType}s-lastSync`, Date.now())
  }

  isEmptyFilters() {
    return !this.props.location.search.length || this.props.location.search == '?'
  }

  reloadFromLocalStorage() {
    var newState = {
      loaded:        true,
      selectedCount: 0
    }
    newState[`${this.itemType}s`] = this.getListFromLocalStorage()

    this.setState(newState)
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $(`.nav.sections li.${this.itemType}s`).addClass('selected')
  }

  openNewModal() {
    $(`.new-${this.itemType}-modal`).modal('show')
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
        if(this.isEmptyFilters()) {
          this.setListToLocalStorage()
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
    var newIds

    //if(filters[field] == undefined) {
      newIds = [newId]
    //}
    // else {
    //   newIds = _.map(filters[field].split(','), (id) => {
    //     return parseInt(id)
    //   })

    //   newIds = _.concat(newIds, newId)
    // }

    var newFilters    = {}
    newFilters[field] = _.uniq(newIds).join(',')

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
