import Select from 'react-select'

class EventsFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options:  [],
      eventIds: this.props.eventIds || ''
    };
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    $.get(this.props.eventOptionsPath, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        options: camelData
      });
    });
  }

  udpdateValue(value) {
    this.setState({ eventIds: value }, () => {
      this.props.updateEventIds(value);
    });
  }

  render() {
    return (
      <div>
        <label>Evènements</label>
        <Select multi={true}
                value={this.state.eventIds}
                options={this.state.options}
                onChange={this.udpdateValue.bind(this)} />
      </div>
    )
  }
}

module.exports = EventsFilter
