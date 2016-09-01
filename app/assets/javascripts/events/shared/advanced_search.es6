import DateRangeFilter from '../../shared/date_range_filter.es6'
import ItemsSelect     from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name:         this.props.filters.name        || '',
      description:  this.props.filters.description || '',
      place:        this.props.filters.place       || '',
    };
  }

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateAdvancedSearchFilters(newFilters);
    })
  }

  updateContactIds(value) {
    this.props.updateAdvancedSearchFilters({
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
                       updateAdvancedSearchFilters={this.props.updateAdvancedSearchFilters} />
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

  renderContactsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.contactIds}
                   optionsPath={this.props.contactOptionsPath}
                   updateValue={this.updateContactIds.bind(this)}
                   label="Contacts" />
    );
  }

}

export default AdvancedSearch
