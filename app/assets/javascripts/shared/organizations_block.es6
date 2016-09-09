import Select from 'react-select'

class OrganizationsBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: []
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

  removeOrganization(organization) {
    if(confirm("Délier cette organisation ?")) {
      var organizationIds = _.filter(this.props.parent.organizationIds, (organizationId) => {
        return organizationId != organization.id;
      });

      this.saveOnBackend(organizationIds);
    }
  }

  addOrganization(option) {
    this.saveOnBackend(
      _.uniq(_.concat(this.props.parent.organizationIds, option.value))
    );
  }

  saveOnBackend(organizationIds) {
    // [''] is a way for the rails server to keep the empty array
    var organizationIds = organizationIds.length ? organizationIds : [''];

    var params = {};
    params[this.props.parentType]                 = {};
    params[this.props.parentType].organizationIds = organizationIds;

    http.put(this.props.parentPath, params, () => {
      this.props.reloadFromBackend(() => {
        setTimeout(this.props.reloadIndexFromBackend, 1500)
      })
    });
  }

  render() {
    return (
      <div className="associations-block organizations-block">
        <div className="row">
          <div className="col-md-12">
            <h3>Organizations ({this.props.parent.organizations.length})</h3>
          </div>
        </div>

        {this.renderOrganizations()}
        {this.renderSelect()}
      </div>
    );
  }

  renderOrganizations() {
    if(this.props.parent.organizations.length) {
      var organizationDivs = _.map(this.props.parent.organizations, (organization) => {
        return this.renderItem(organization);
      });

      return (
        <div className="row">
          {organizationDivs}
        </div>
      )
    }
    else {
      return (
        <div className="row">
          {this.props.emptyMessage}
        </div>
      )
    }
  }

  renderItem(organization) {
    return (
      <div className="col-md-6 association organization" key={organization.id}>
        <div className="association-inside">
          <img className="img-thumbnail" src={organization.thumbPictureUrl} />
          <h4>
            <Link to={organization.scopedPath}>{organization.name}</Link>
          </h4>

          <i className="fa fa-times remove-icon"
             onClick={this.removeOrganization.bind(this, organization)}>
          </i>
        </div>
      </div>
    )
  }

  renderSelect() {
    var filteredOptions = _.reject(this.state.options, (option) => {
      return _.includes(this.props.parent.organizationIds, option.value);
    })

    return (
      <div className="select">
        <Select multi={false}
                options={filteredOptions}
                placeholder="Ajouter..."
                onChange={this.addOrganization.bind(this)} />
      </div>
    );
  }
}

module.exports = OrganizationsBlock
