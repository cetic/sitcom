import BaseMain         from '../shared/base/base_main.es6'
import Events           from './index/events.es6'
import Event            from './show/event.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import SavedSearches    from '../shared/saved_searches.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.itemType       = 'event'
    this.newButtonLabel = 'Nouvel évènement'

    this.state = {
      events: [],
      loaded: false
    }
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

  renderSavedSearches() {
    return(
      <SavedSearches router={this.props.router}
                     search={this.props.location.search}
                     itemType="event"
                     savedSearchesPath={`${this.props.eventsPath}/saved_searches`} />
    )
  }

  renderAdvancedSearch(filters) {
    return (
      <AdvancedSearch filters={filters}
                      contactOptionsPath={this.props.contactOptionsPath}
                      updateFilters={this.updateFilters.bind(this)} />
    )
  }

  renderQuickSearch(filters) {
    return (
      <QuickSearch title="Évènements"
                   loaded={this.state.loaded}
                   results={this.state.events.length}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)} />
    )
  }

  renderItems() {
    return (
            <Events events={this.state.events}
                    loaded={this.state.loaded}
                    search={this.props.location.search}
                    loadingImagePath={this.props.loadingImagePath} />
          )
  }

  renderItem() {
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

  renderNewModal() {
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
