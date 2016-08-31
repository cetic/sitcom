import DatePicker from 'react-datepicker'

export default class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value ? moment(this.props.value, 'YYYY-MM-DD') : moment()
    };
  }

  updateValue(date) {
    this.setState({ value: date }, () => {
      this.props.onChange(
        this.state.value.format('YYYY-MM-DD')
      );
    });
  }

  render() {
    return (
      <DatePicker
          showYearDropdown
          fixedHeight
          selected={this.state.value}
          locale='fr-be'
          onChange={this.updateValue.bind(this)} />
    );
  }

}
