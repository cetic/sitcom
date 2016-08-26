import DatePicker from 'react-datepicker'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:         this.props.filters.name        || '',
      description:  this.props.filters.description || '',
      datesEnabled: false,
      startDate:    moment(),
      endDate:      moment()
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
    this.setState({ startDate: date }, this.updateDates)

  }

  updateEndDate(date) {
    this.setState({ endDate: date }, this.updateDates)
  }

  updateDatesEnabled() {
    this.setState({ datesEnabled: !this.state.datesEnabled }, this.updateDates)
  }

  updateDates() {
    this.props.updateAdvancedSearchFilters({
      from: this.state.datesEnabled ? this.state.startDate.format('YYYY-MM-DD') : '',
      to:   this.state.datesEnabled ? this.state.endDate.format('YYYY-MM-DD') : '',
    })
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
    var datePickerclassNames =  "datepickers"

    if(!this.state.datesEnabled)
      datePickerclassNames += " disabled"

    return (
      <div>
        <label>Date (intervalle)</label><br />

        <input type="checkbox" checked={this.state.datesEnabled}
                               onChange={this.updateDatesEnabled.bind(this)}
                               id="dates-enabled" />
        <label htmlFor="dates-enabled">&nbsp;Activer</label>

        <div className={datePickerclassNames}>
          <DatePicker
              inline
              showYearDropdown
              fixedHeight
              selected={this.state.startDate}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              locale='fr-be'
              onChange={this.updateStartDate.bind(this)} />

          <DatePicker
              inline
              showYearDropdown
              fixedHeight
              selected={this.state.endDate}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              locale='fr-be'
              onChange={this.updateEndDate.bind(this)} />
        </div>
      </div>
    );
  }
}

module.exports = AdvancedSearch
