import Organizations    from './index/organizations.es6'
import Organization     from './show/organization.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import ParamsService    from '../shared/params_service.es6'
import PermissionDenied from '../shared/permission_denied.es6'
import SavedSearches    from '../shared/saved_searches.es6'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      organizations: [],
      loaded:        false,
    }
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
    $('.nav.sections li.organizations').addClass('selected')
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

  reloadFromBackend(spinner = true) {
    if(spinner) {
      this.setState({ loaded: false })
    }

    http.get(this.props.organizationsPath, this.getFilters(), (data) => {
      this.setState({
        organizations: data.organizations,
        loaded:        true,
      })
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues)
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('organizations?' + paramsString)
  }

  updateQuickSearch(newQuickSearch) {
    this.updateFilters({
      quickSearch: newQuickSearch
    })
  }

  updateFilters(newFilters) {
    this.updateUrl(newFilters)
  }

  openNewOrganizationModal() {
    $('.new-organization-modal').modal('show')
  }

  render() {
    if(this.props.permissions.canReadOrganizations) {
      var filters = this.getFilters()

      return (
        <div className="container-fluid container-organization">
          <div className="row">
            <div className="col-md-4 pull-right right-sidebar">
              <SavedSearches router={this.props.router}
                             search={this.props.location.search}
                             itemType="organization"
                             savedSearchesPath={`${this.props.organizationsPath}/saved_searches`} />

              <AdvancedSearch filters={filters}
                              updateFilters={this.updateFilters.bind(this)}
                              contactOptionsPath={this.props.contactOptionsPath}
                              organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath} />
            </div>

            <div className="col-md-8 col-organizations">
              <QuickSearch title="Organisations"
                           loaded={this.state.loaded}
                           results={this.state.organizations.length}
                           quickSearch={filters.quickSearch}
                           updateQuickSearch={this.updateQuickSearch.bind(this)}
                           filters={filters}
                           exportUrl={this.props.organizationsPath + '/export'} />

              { this.renderNewOrganizationLink() }

              { this.renderOrganization() }
              { this.renderOrganizations() }
            </div>
          </div>

          { this.renderNewOrganizationModal() }
        </div>
      )
    }
    else {
      return (
        <PermissionDenied />
      )
    }
  }

  renderNewOrganizationLink() {
    if(this.props.permissions.canWriteOrganizations) {
      return (
        <button className="btn btn-primary new"
                onClick={this.openNewOrganizationModal.bind(this)}>
          Nouvelle organisation
        </button>
      )
    }
  }

  renderOrganizations() {
    if(!this.props.params.id) {
      return (
        <Organizations organizations={this.state.organizations}
                       loaded={this.state.loaded}
                       search={this.props.location.search}
                       loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }

  renderOrganization() {
    if(this.props.params.id) {
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
  }

  renderNewOrganizationModal() {
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
