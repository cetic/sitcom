import BaseMain       from '../shared/base/base_main.es6'
import Events         from './index/events.es6'
import Event          from './show/event.es6'
import NewItem        from '../shared/new_item.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import SavedSearches  from '../shared/saved_searches.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.title          = 'Évènements'
    this.itemType       = 'event'
    this.newButtonLabel = 'Nouvel évènement'
    this.SavedSearches  = SavedSearches
    this.AdvancedSearch = AdvancedSearch

    this.state = {
      events: [],
      loaded: false
    }
  }

  getFilters() {
    return {
      quickSearch: this.props.location.query.quickSearch || '',
      name:        this.props.location.query.name        || '',
      description: this.props.location.query.description || '',
      place:       this.props.location.query.place       || '',
      notes:       this.props.location.query.notes       || '',
      contactIds:  this.props.location.query.contactIds,
    }
  }

  renderItems() {
    return (
      <Events events={this.state.events}
              loaded={this.state.loaded}
              search={this.props.location.search}
              loadingImagePath={this.props.route.loadingImagePath} />
    )
  }

  renderItem() {
    var urlEventId = parseInt(this.props.params.id)
    var event      = _.find(this.state.events, (event) => { return event.id == urlEventId } )

    return (
      <Event id={urlEventId}
             event={event}
             permissions={this.props.route.permissions}
             currentUserId={this.props.route.currentUserId}
             labId={this.props.route.labId}
             loaded={this.state.loaded}
             eventsPath={this.props.route.eventsPath}
             search={this.props.location.search}
             loadingImagePath={this.props.route.loadingImagePath}
             contactOptionsPath={this.props.route.contactOptionsPath}
             events={this.state.events}
             router={this.props.router} />
    )
  }

  renderNewModal() {
    return (
      <NewItem itemsPath={this.props.route.eventsPath}
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
