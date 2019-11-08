import DatePicker from 'react-datepicker'

class DateRangeFilter extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      datesEnabled: this.props.filters.from || this.props.filters.to || false,
      startDate:    this.props.filters.from ? moment(this.props.filters.from, 'YYYY-MM-DD') : moment(),
      endDate:      this.props.filters.to   ? moment(this.props.filters.to,   'YYYY-MM-DD') : moment()
    }
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
    this.props.updateFilters({
      from: this.state.datesEnabled ? this.state.startDate.format('YYYY-MM-DD') : '',
      to:   this.state.datesEnabled ? this.state.endDate.format('YYYY-MM-DD')   : '',
    })
  }

  render() {
    var datePickerclassNames =  "datepickers"

    if(!this.state.datesEnabled)
      datePickerclassNames += " disabled"

    return (
      <div className="date-range-filter">
        <input type="checkbox" checked={this.state.datesEnabled}
                               onChange={this.updateDatesEnabled.bind(this)}
                               id="dates-enabled" />

        &nbsp;&nbsp;<label htmlFor="dates-enabled">Activer</label>

        <div className={datePickerclassNames}>
          <DatePicker inline
                      showYearDropdown
                      fixedHeight
                      selected={this.state.startDate}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      maxDate={this.state.endDate}
                      locale='fr-be'
                      onChange={this.updateStartDate.bind(this)} />

          <DatePicker inline
                      showYearDropdown
                      fixedHeight
                      selected={this.state.endDate}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      minDate={this.state.startDate}
                      locale='fr-be'
                      onChange={this.updateEndDate.bind(this)} />
        </div>
      </div>
    )
  }

}

module.exports = DateRangeFilter
