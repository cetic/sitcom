module.exports = class extends React.Component {
  componentDidMount() {
    $(this.refs.input).datepicker({
      language: 'fr',
      format: 'yyyy-mm-dd',
      weekStart: 1,
      todayHighlight: true,
      autoclose: true,
    });

    $(this.refs.input).on('changeDate', (data) => {
      var fDate = moment(data.date).format('YYYY-MM-DD');

      if(this.props.onChange)
        this.props.onChange(fDate)
    });
  }

  render() {
    return (
      <input ref="input"
             className="form-control from-control-datepicker"
             id={this.props.id} type="text"
             value={this.props.value}
             style={{backgroundColor: '#fff'}}
             readOnly />
    );
  }
}
