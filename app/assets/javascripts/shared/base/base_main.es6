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
    this.reloadFromBackend()
    this.selectHeaderMenu()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.location.search != this.props.location.search) {
      this.dReloadFromBackend()
    }
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $(`.nav.sections li.${this.itemType}s`).addClass('selected')
  }

  openNewModal() {
    $(`.new-${this.itemType}-modal`).modal('show')
  }

  reloadFromBackend(spinner = true) {
    const itemsPath = this.props[`${this.itemType}sPath`]

    if(spinner) {
      this.setState({ loaded: false })
    }

    http.get(itemsPath, this.getFilters(), (data) => {
      var newState = {
        loaded:        true,
        selectedCount: 0
      }

      newState[`${this.itemType}s`] = data[`${this.itemType}s`]
      this.setState(newState)
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues)
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
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

  pushIdsListFilter(field, newId) {
    var filters = this.getFilters()
    var newIds

    if(filters[field] == undefined) {
      newIds = [newId]
    }
    else {
      newIds = _.map(filters[field].split(','), (id) => {
        return parseInt(id)
      })

      newIds = _.concat(newIds, newId)
    }

    var newFilters    = {}
    newFilters[field] = _.uniq(newIds).join(',')

    this.updateFilters(newFilters)
  }

  render() {
    const canRead = this.props.permissions[`canRead${_.upperFirst(this.itemType)}s`]

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
    const pathPrefix        = this.props[`${this.itemType}sPath`]
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
                           tagOptionsPath={this.props.tagOptionsPath}
                           fieldOptionsPath={this.props.fieldOptionsPath}
                           contactOptionsPath={this.props.contactOptionsPath}
                           organizationOptionsPath={this.props.organizationOptionsPath}
                           projectOptionsPath={this.props.projectOptionsPath}
                           eventOptionsPath={this.props.eventOptionsPath}
                           organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath} />
    )
  }

  renderQuickSearch(filters) {
    return (
      <QuickSearch title={this.title}
                   loaded={this.state.loaded}
                   results={this.state[`${this.itemType}s`].length}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)}
                   reloadIndexFromBackend={this.reloadFromBackend.bind(this)}
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
    if(this.props.permissions[`canWrite${_.upperFirst(this.itemType)}s`]) {
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
