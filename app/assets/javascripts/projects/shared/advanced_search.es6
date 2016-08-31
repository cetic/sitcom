import DateRangeFilter from '../../shared/date_range_filter.es6'
import ItemsSelect     from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.filters.name        || '',
      description: this.props.filters.description || ''
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
        {this.renderDescriptionFilter()}
        {this.renderDatesFilter()}
        {this.renderContactsFilter()}
      </div>
    );
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="projects_name">Nom</label><br />
        <input type="text"
               id="projects_name"
               value={this.state.name}
               onChange={this.updateTextFilter.bind(this, 'name')} />
      </div>
    );
  }

  renderDescriptionFilter() {
    return (
      <div>
        <label htmlFor="projects_description">Description</label><br />
        <input type="text"
               id="projects_description"
               value={this.state.description}
               onChange={this.updateTextFilter.bind(this, 'description')} />
      </div>
    );
  }

  renderDatesFilter() {
    return (
      <DateRangeFilter filters={this.props.filters}
                       updateAdvancedSearchFilters={this.props.updateAdvancedSearchFilters} />
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
