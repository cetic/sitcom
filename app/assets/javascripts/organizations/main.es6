import Organizations    from './index/organizations.es6'
import Organization     from './show/organization.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import ParamsService    from '../shared/params_service.es6'
import PermissionDenied from '../shared/permission_denied.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'status', 'description', 'websiteUrl',
      'contactIds'
    ];

    this.state = {
      organizations: [],
      loaded:        false,
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
    this.selectHeaderMenu()
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.filtersHaveChanged(prevProps)) {
      this.reloadFromBackend();
    }
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $('.nav.sections li.organizations').addClass('selected')
  }

  filtersHaveChanged(prevProps) {
    return _.some(this.filterNames, (filterName) => {
      return prevProps.location.query[filterName] != this.props.location.query[filterName];
    });
  }

  buildFilterParams() {
    return _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
      return this.props.location.query[filterName];
    }));
  }

  reloadFromBackend(offset = 0) {
    var params = _.assign({}, this.buildFilterParams(), {
      offset: offset
    });

    http.get(this.props.organizationsPath, params, (data) => {
      this.setState({
        organizations: offset == 0 ? data.organizations : this.state.organizations.concat(data.organizations),
        loaded:        true,
      });
    });
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues);
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('organizations?' + paramsString);
  }

  updateQuickSearch(newQuickSearch) {
    this.setState({ loaded: false })

    this.dUpdateUrl({
      quickSearch: newQuickSearch
    });
  }

  updateAdvancedSearchFilters(newFilters) {
    this.setState({ loaded: false })

    this.dUpdateUrl(newFilters);
  }

  openNewOrganizationModal() {
    $('.new-organization-modal').modal('show')
  }

  render() {
    if(this.props.permissions.canReadOrganizations) {
      var advancedSearchFilters = _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
        return this.props.location.query[filterName];
      }));

      return (
        <div className="container-fluid container-organization">
          <div className="row">
            <div className="col-md-4 pull-right complete-search">
              <AdvancedSearch filters={advancedSearchFilters}
                              updateAdvancedSearchFilters={this.updateAdvancedSearchFilters.bind(this)}
                              contactOptionsPath={this.props.contactOptionsPath}
                              organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath} />
            </div>

            <div className="col-md-8 col-organizations">
              <QuickSearch title="Organisations"
                           loaded={this.state.loaded}
                           results={this.state.organizations.length}
                           quickSearch={this.props.location.query.quickSearch}
                           updateQuickSearch={this.updateQuickSearch.bind(this)} />

              { this.renderNewOrganizationLink() }

              { this.renderOrganization()  }
              { this.renderOrganizations() }
            </div>
          </div>

          { this.renderNewOrganizationModal() }
        </div>
      );
    }
    else {
      return (
        <PermissionDenied />
      )
    }
  }

  renderNewOrganizationLink() {
    return (
      <button className="btn btn-primary new"
              onClick={this.openNewOrganizationModal.bind(this)}>
        Nouvelle organisation
      </button>
    )
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
