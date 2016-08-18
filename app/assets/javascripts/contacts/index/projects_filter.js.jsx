import Select from 'react-select'

class ProjectsFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options:    [],
      projectIds: this.props.projectIds || ''
    };
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    $.get(this.props.projectOptionsPath, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        options: camelData
      });
    });
  }

  udpdateValue(value) {
    this.setState({ projectIds: value }, () => {
      this.props.updateProjectIds(value);
    });
  }

  render() {
    return (
      <div>
        <label>Projets</label>
        <Select multi={true}
                value={this.state.projectIds}
                options={this.state.options}
                onChange={this.udpdateValue.bind(this)} />
      </div>
    )
  }
}

module.exports = ProjectsFilter
