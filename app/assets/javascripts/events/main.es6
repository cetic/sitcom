import Events           from './index/events.es6'
import Event            from './show/event.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import ParamsService    from '../shared/params_service.es6'
import PermissionDenied from '../shared/permission_denied.es6'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      events: [],
      loaded: false
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
    this.dReloadFromBackend()
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $('.nav.sections li.events').addClass('selected')
  }

  getFilters() {
    return {
      quickSearch:  this.props.location.query.quickSearch || '',
      name:         this.props.location.query.name        || '',
      description:  this.props.location.query.description || '',
      place:        this.props.location.query.place       || '',
      notes:        this.props.location.query.notes       || '',
      contactIds:   this.props.location.query.contactIds,
    }
  }

  reloadFromBackend(offset = 0) {
    this.setState({ loaded: false })

    var params = _.assign({}, this.getFilters(), {
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
    this.updateFilters({
      quickSearch: newQuickSearch
    })
  }

  updateFilters(newFilters) {
    this.updateUrl(newFilters)
  }

  openNewEventModal() {
    $('.new-event-modal').modal('show')
  }

  render() {
    if(this.props.permissions.canReadEvents) {
      var filters = this.getFilters()

      return (
        <div className="container-fluid container-event">
          <div className="row">
            <div className="col-md-4 pull-right complete-search">
              <AdvancedSearch filters={filters}
                              contactOptionsPath={this.props.contactOptionsPath}
                              updateFilters={this.updateFilters.bind(this)} />
            </div>

            <div className="col-md-8 col-events">
              <QuickSearch title="Évènements"
                           loaded={this.state.loaded}
                           results={this.state.events.length}
                           quickSearch={filters.quickSearch}
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
    else {
      return (
        <PermissionDenied />
      )
    }
  }

  renderNewEventLink() {
    if(this.props.permissions.canWriteEvents) {
      return (
        <button className="btn btn-primary new"
                onClick={this.openNewEventModal.bind(this)}>
          Nouvel évènement
        </button>
      )
    }
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
               permissions={this.props.permissions}
               loaded={this.state.loaded}
               eventsPath={this.props.eventsPath}
               search={this.props.location.search}
               loadingImagePath={this.props.loadingImagePath}
               contactOptionsPath={this.props.contactOptionsPath}
               reloadIndexFromBackend={this.reloadFromBackend.bind(this)}
               events={this.state.events}
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
