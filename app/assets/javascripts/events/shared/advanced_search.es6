import DatePicker from 'react-datepicker'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.filters.name        || '',
      description: this.props.filters.description || '',
      startDate:   moment(),
      endDate:     moment()
    };
  }

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateAdvancedSearchFilters(newFilters);
    })
  }

  updateStartDate(date) {
    // this.props.updateAdvancedSearchFilters({
    //   happensOnFrom: value
    // });

    this.setState({ startDate: date })
  }

  updateEndDate(date) {
    // this.props.updateAdvancedSearchFilters({
    //   happensOnFrom: value
    // });

    this.setState({ endDate: date })
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

        <DatePicker
            inline
            showYearDropdown
            selected={this.state.startDate}
            locale='fr-be'
            onChange={this.updateStartDate.bind(this)} />

        <DatePicker
            inline
            showYearDropdown
            selected={this.state.endDate}
            locale='fr-be'
            onChange={this.updateEndDate.bind(this)} />
      </div>
    );
  }
}

module.exports = AdvancedSearch
