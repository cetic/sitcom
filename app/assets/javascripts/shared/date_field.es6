import DatePicker from 'react-datepicker'

class DateField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      active: _.trim(this.props.value).length > 0,
      value:  this.props.value ? moment(this.props.value, 'YYYY-MM-DD') : moment()
    };
  }

  updateValue(date) {
    this.setState({ value: date }, this.triggerOnChange);
  }

  toggleActive() {
    this.setState({ active: !this.state.active }, () => {
      this.triggerOnChange();

      if(this.state.active) {
        $(ReactDOM.findDOMNode(this.refs.picker)).find('input').focus();
      }
    });
  }

  triggerOnChange() {
    this.props.onChange(
      this.state.active ? this.state.value.format('YYYY-MM-DD') : ''
    );
  }

  render() {
    if(this.state.active) {
      return (
        <div className="date-field">
          {this.renderDatePicker()}
          <a href="javascript:;" onClick={this.toggleActive.bind(this)} className="reset-value">
            <i className="fa fa-times"></i>
          </a>
        </div>
      );
    }
    else {
      return (
        <div className="date-field">
          <a href="javascript:;" onClick={this.toggleActive.bind(this)}>Sélectionner une date</a>
        </div>
      );
    }
  }

  renderDatePicker() {
    var minDate = this.props.minDate ? moment(this.props.minDate, 'YYYY-MM-DD') : undefined;
    var maxDate = this.props.maxDate ? moment(this.props.maxDate, 'YYYY-MM-DD') : undefined;

    return (
      <DatePicker showYearDropdown
                  fixedHeight
                  ref="picker"
                  selected={this.state.value}
                  locale='fr-be'
                  onChange={this.updateValue.bind(this)}
                  minDate={minDate}
                  maxDate={maxDate} />
    );
  }
}

module.exports = DateField
