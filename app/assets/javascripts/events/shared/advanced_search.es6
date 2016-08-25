import DatePickerInput from '../../shared/datepicker_input.es6'

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

  updateHappensOnFrom(value) {
    this.props.updateAdvancedSearchFilters({
      happensOnFrom: value
    });
  }

  updateHappensOnTo(value) {
    this.props.updateAdvancedSearchFilters({
      happensOnFrom: value
    });
  }

  render() {
    return (
      <div>
        <h3>Recherche avancée</h3>
        <h4>Général</h4>

        {this.renderNameFilter()}
        {this.renderDescriptionFilter()}
        {this.renderHappensOnFilter()}
      </div>
    );
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="organizations_name">Nom</label><br />
        <input type="text"
               id="organizations_name"
               value={this.state.name}
               onChange={this.updateTextFilter.bind(this, 'name')} />
      </div>
    );
  }

  renderDescriptionFilter() {
    return (
      <div>
        <label htmlFor="organizations_description">Description</label><br />
        <input type="text"
               id="organizations_description"
               value={this.state.description}
               onChange={this.updateTextFilter.bind(this, 'description')} />
      </div>
    );
  }

  renderHappensOnFilter() {
    return (
      <div>
        <label htmlFor="organizations_description">Date (intervalle)</label><br />

        <DatePickerInput onChange={this.updateHappensOnFrom.bind(this)} value="2015-02-02" />
        <DatePickerInput onChange={this.updateHappensOnTo.bind(this)} />
      </div>
    );
  }
}

module.exports = AdvancedSearch
