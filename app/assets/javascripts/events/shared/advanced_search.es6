import DateRangeFilter from '../../shared/date_range_filter.es6'
import ItemsSelect     from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name:         this.props.filters.name        || '',
      description:  this.props.filters.description || '',
      place:        this.props.filters.place       || '',
      notes:        this.props.filters.notes       || ''
    };
  }

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateFilters(newFilters);
    })
  }

  updateContactIds(value) {
    this.props.updateFilters({
      contactIds: value
    });
  }

  render() {
    return (
      <div>
        <h3>Recherche avancée</h3>
        <h4>Général</h4>

        {this.renderNameFilter()}
        {this.renderPlaceFilter()}
        {this.renderDescriptionFilter()}
        {this.renderNotesFilter()}
        {this.renderHappensOnFilter()}
        {this.renderContactsFilter()}
      </div>
    );
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="events_name">Nom</label><br />
        <input type="text"
               id="events_name"
               value={this.state.name}
               onChange={this.updateTextFilter.bind(this, 'name')} />
      </div>
    );
  }

  renderPlaceFilter() {
    return (
      <div>
        <label htmlFor="events_place">Lieu</label><br />
        <input type="text"
               id="events_place"
               value={this.state.place}
               onChange={this.updateTextFilter.bind(this, 'place')} />
      </div>
    );
  }

  renderHappensOnFilter() {
    return (
      <DateRangeFilter filters={this.props.filters}
                       updateFilters={this.props.updateFilters} />
    );
  }

  renderDescriptionFilter() {
    return (
      <div>
        <label htmlFor="events_description">Description</label><br />
        <input type="text"
               id="events_description"
               value={this.state.description}
               onChange={this.updateTextFilter.bind(this, 'description')} />
      </div>
    );
  }

  renderNotesFilter() {
    return (
      <div>
        <label htmlFor="events_notes">Notes</label><br />
        <input type="text"
               id="events_notes"
               value={this.state.notes}
               onChange={this.updateTextFilter.bind(this, 'notes')} />
      </div>
    );
  }

  renderContactsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.contactIds}
                   optionsPath={this.props.contactOptionsPath}
                   updateValue={this.updateContactIds.bind(this)}
                   label="Contacts" />
    );
  }

}

module.exports = AdvancedSearch
