import Select from 'react-select'

class ItemsSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      itemIds: this.props.itemIds || ''
    };
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    http.get(this.props.optionsPath, {}, (data) => {
      this.setState({
        options: data
      });
    });
  }

  updateValue(options) {
    var value = _.map(options, (option) => {
      return option.value;
    }).join(',');

    this.setState({ itemIds: value }, () => {
      this.props.updateValue(value);
    });
  }

  getValue() {
    var value = [];
    var ids   = this.state.itemIds.split(',');

    if(ids.length && ids[0] != '') {
      var value = _.map(ids, (id) => {
        var option = _.find(this.state.options, (option) => {
          return option.value == parseInt(id);
        });

        return {
          label: option.label,
          value: id
        };
      });
    }

    return value;
  }

  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        {this.renderSelect()}
      </div>
    )
  }

  renderSelect() {
    if(this.state.options.length) {
      return (
        <Select multi={true}
                value={this.getValue()}
                options={this.state.options}
                onChange={this.updateValue.bind(this)}
                optionRenderer={this.renderOption.bind(this)} />
      );
    }
  }

  renderOption(option) {
    if(option.highlight) {
      return ( <div><strong>{option.label}</strong></div> );
    }
    else {
      return ( <div>{option.label}</div> );
    }
  }
}

export default ItemsSelect
