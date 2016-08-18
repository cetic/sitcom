import Select from 'react-select'

class OrganizationFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      organizationIds: this.props.organizationIds || ''
    };
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    $.get(this.props.organizationOptionsPath, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        options: camelData
      });
    });
  }

  updateValue(value) {
    this.setState({ organizationIds: value }, () => {
      this.props.updateOrganizationIds(value);
    });
  }

  render() {
    return (
      <div>
        <label>Organisations</label>
        <Select multi={true}
                value={this.state.organizationIds}
                options={this.state.options}
                onChange={this.updateValue.bind(this)} />
      </div>
    )
  }
}

module.exports = OrganizationFilter
