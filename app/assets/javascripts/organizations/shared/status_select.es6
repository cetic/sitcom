import Select from 'react-select'

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      value:   this.props.value || ''
    };
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    $.get(this.props.optionsPath, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        options: camelData
      });
    });
  }

  updateValue(option) {
    var value = option ? option.value : undefined;

    this.setState({ value: value }, () => {
      this.props.updateValue(value);
    });
  }

  getValue() {
    if(_.trim(this.state.value) != '') {
      var option = _.find(this.state.options, (option) => {
        return option.value == this.state.value;
      });

      return {
        label: option.label,
        value: option.value
      };
    }
  }

  render() {
    if(this.state.options.length) {
      return (
        <Select multi={false}
                value={this.getValue()}
                options={this.state.options}
                onChange={this.updateValue.bind(this)} />
      );
    }
    else {
      return (
        <div />
      );
    }
  }
}
