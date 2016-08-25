import Events         from './index/events.es6'
import Event          from './show/event.es6'
import QuickSearch    from '../shared/quick_search.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import ParamsService  from '../shared/params_service.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'description'
    ];

    this.state = {
      events: [],
      loaded:        false,

      infiniteLoaded:  true,
      infiniteEnabled: true,
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
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

    $.get(this.props.eventsPath, params, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        events:        offset == 0 ? camelData.events : this.state.events.concat(camelData.events),
        loaded:          true,
        infiniteLoaded:  true,
        infiniteEnabled: camelData.events.length == window.infiniteScrollStep // no more results
      });
    });
  }

  loadNextBatchFromBackend() {
    this.setState({ infiniteLoaded: false }, () => {
      this.dReloadFromBackend(this.state.events.length);
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues);
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('?' + paramsString);
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
      <div className="container-fluid container-event">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <AdvancedSearch filters={advancedSearchFilters}
                            updateAdvancedSearchFilters={this.updateAdvancedSearchFilters.bind(this)} />
          </div>

          <div className="col-md-8">
            <QuickSearch quickSearch={this.props.location.query.quickSearch}
                         updateQuickSearch={this.updateQuickSearch.bind(this)} />

            { this.renderEvent()  }
            { this.renderEvents() }
          </div>
        </div>
      </div>
    );
  }

  renderEvents() {
    if(!this.props.params.id) {
      return (
        <Events events={this.state.events}
                       loaded={this.state.loaded}
                       search={this.props.location.search}
                       loadingImagePath={this.props.loadingImagePath}
                       infiniteEnabled={this.state.infiniteEnabled}
                       infiniteScrollOffset={this.state.infiniteScrollOffset}
                       infiniteLoaded={this.state.infiniteLoaded}
                       loadNextBatchFromBackend={this.loadNextBatchFromBackend.bind(this)} />
      )
    }
  }

  renderEvent() {
    if(this.props.params.id) {
      return (
        <Event id={this.props.params.id}
                      eventsPath={this.props.eventsPath}
                      search={this.props.location.search}
                      loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}

module.exports = Main
