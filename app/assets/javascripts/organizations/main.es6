import Organizations  from './index/organizations.es6'
import Organization   from './show/organization.es6'
import QuickSearch    from './shared/quick_search.es6'
import AdvancedSearch from './shared/advanced_search.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'description', 'websiteUrl'
    ];

    this.state = {
      organizations:        [],
      loaded:               false,
      infiniteLoaded:       true,
      infiniteEnabled:      true,
      infiniteScrollOffset: 200
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
    this.bindInfiniteScroll();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.filtersHaveChanged(prevProps)) {
      this.reloadFromBackend();
    }
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
    var params = humps.decamelizeKeys(_.assign({}, this.buildFilterParams(), {
      offset: offset
    }));

    $.get(this.props.organizationsPath, params, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        organizations:   offset == 0 ? camelData.organizations : this.state.organizations.concat(camelData.organizations),
        loaded:          true,
        infiniteLoaded:  true,
        infiniteEnabled: camelData.organizations.length == window.infiniteScrollStep // no more results
      });
    });
  }

  bindInfiniteScroll() {
    $(window).scroll(() => {
      if(this.state.infiniteLoaded && this.state.infiniteEnabled && this.state.loaded) {
        if($(window).scrollTop() + $(window).height() >= $(document).height() - this.state.infiniteScrollOffset) {
          var offset = this.state.organizations.length;

          this.setState({ infiniteLoaded: false }, () => {
            this.dReloadFromBackend(offset);
          })
        }
      }
    })
  }

  updateUrl(newValues) {
    var query = _.assign({}, this.props.location.query, newValues);

    if(_.trim(query.quickSearch).length == 0) {
      delete query.quickSearch;
    }

    if(_.trim(query.name).length == 0) {
      delete query.name;
    }

    if(_.trim(query.description).length == 0) {
      delete query.description;
    }

    if(_.trim(query.websiteUrl).length == 0) {
      delete query.websiteUrl;
    }

    this.props.router.push('?' + $.param(query));
  }

  updateQuickSearch(newQuickSearch) {
    this.dUpdateUrl({
      quickSearch: newQuickSearch
    });
  }

  updateAdvancedSearchFilters(newFilters) {
    this.dUpdateUrl(newFilters);
  }

  render() {
    var advancedSearchFilters = _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
      return this.props.location.query[filterName];
    }));

    return (
      <div className="container-fluid container-organization">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <AdvancedSearch filters={advancedSearchFilters}
                            updateAdvancedSearchFilters={this.updateAdvancedSearchFilters.bind(this)} />
          </div>

          <div className="col-md-8">
            <QuickSearch quickSearch={this.props.location.query.quickSearch}
                         updateQuickSearch={this.updateQuickSearch.bind(this)} />

            { this.renderOrganization()  }
            { this.renderOrganizations() }
          </div>
        </div>
      </div>
    );
  }

  renderOrganizations() {
    if(!this.props.params.id) {
      return (
        <Organizations organizations={this.state.organizations}
                       loaded={this.state.loaded}
                       search={this.props.location.search}
                       infiniteLoaded={this.state.infiniteLoaded} />
      )
    }
  }

  renderOrganization() {
    if(this.props.params.id) {
      return (
        <Organization id={this.props.params.id}
                      organizationsPath={this.props.organizationsPath}
                      search={this.props.location.search}
                      loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}

module.exports = Main
