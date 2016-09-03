import Events         from './index/events.es6'
import Event          from './show/event.es6'
import NewItem        from '../shared/new_item.es6'
import QuickSearch    from '../shared/quick_search.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import ParamsService  from '../shared/params_service.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'place', 'description', 'from', 'to',
      'contactIds'
    ];

    this.state = {
      events: [],
      loaded: false
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
    this.selectHeaderMenu()
    $('.quick-search input').focus()
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.filtersHaveChanged(prevProps)) {
      this.reloadFromBackend();
    }
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $('.nav.sections li.events').addClass('selected')
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

    http.get(this.props.eventsPath, params, (data) => {
      this.setState({
        events: offset == 0 ? data.events : this.state.events.concat(data.events),
        loaded: true,
      });
    });
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues);
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('events?' + paramsString);
  }

  updateQuickSearch(newQuickSearch) {
    this.dUpdateUrl({
      quickSearch: newQuickSearch
    });
  }

  updateAdvancedSearchFilters(newFilters) {
    this.dUpdateUrl(newFilters);
  }

  openNewEventModal() {
    $('.new-event-modal').modal('show')
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
                            contactOptionsPath={this.props.contactOptionsPath}
                            updateAdvancedSearchFilters={this.updateAdvancedSearchFilters.bind(this)} />
          </div>

          <div className="col-md-8 col-events">
            <QuickSearch quickSearch={this.props.location.query.quickSearch}
                         updateQuickSearch={this.updateQuickSearch.bind(this)} />

            { this.renderNewEventLink() }

            { this.renderEvent()  }
            { this.renderEvents() }
          </div>
        </div>

        { this.renderNewEventModal() }
      </div>
    );
  }

  renderNewEventLink() {
    return (
      <button className="btn btn-primary new"
              onClick={this.openNewEventModal.bind(this)}>
        Nouvel évènement
      </button>
    )
  }

  renderEvents() {
    if(!this.props.params.id) {
      return (
        <Events events={this.state.events}
                loaded={this.state.loaded}
                search={this.props.location.search}
                loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }

  renderEvent() {
    if(this.props.params.id) {
      return (
        <Event id={this.props.params.id}
               eventsPath={this.props.eventsPath}
               search={this.props.location.search}
               loadingImagePath={this.props.loadingImagePath}
               contactOptionsPath={this.props.contactOptionsPath}
               reloadIndexFromBackend={this.reloadFromBackend.bind(this)}
               router={this.props.router} />
      )
    }
  }

  renderNewEventModal() {
    return (
      <NewItem reloadFromBackend={this.reloadFromBackend.bind(this)}
               itemsPath={this.props.eventsPath}
               router={this.props.router}
               modalClassName="new-event-modal"
               modalTitle="Nouvel évènement"
               modelName="event"
               fieldName="name"
               fieldTitle="Nom" />
    )
  }
}

module.exports = Main
