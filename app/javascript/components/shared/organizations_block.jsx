import Select from 'react-select'

import Organization from './organizations_block/organization.jsx'

export default class OrganizationsBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: []
    }
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  organizationIds() {
    return _.map(this.props.parent.organizationLinks, (link) => {
      return link.organization.id
    })
  }

  reloadOptionsFromBackend() {
    http.get(this.props.optionsPath, {}, (data) => {
      this.setState({
        options: data
      })
    })
  }

  removeOrganization(organization) {
    if(confirm("Délier cette organisation ?")) {
      var organizationIds = _.filter(this.organizationIds(), (organizationId) => {
        return organizationId != organization.id
      })

      this.saveOnBackend(organizationIds)
    }
  }

  addOrganization(option) {
    this.saveOnBackend(
      _.uniq(_.concat(this.organizationIds(), option.value))
    )
  }

  saveOnBackend(organizationIds) {
    // [''] is a way for the rails server to keep the empty array
    var ids = organizationIds.length ? organizationIds : ['']

    var params = {}
    params[this.props.parentType]                 = {}
    params[this.props.parentType].organizationIds = ids

    http.put(this.props.parentPath, params)
  }

  render() {
    return (
      <div className="associations-block organizations-block">
        <div className="row">
          <div className="col-md-12">
            <h3>Organisations ({this.props.parent.organizationLinks.length})</h3>
          </div>
        </div>

        {this.renderOrganizations()}
        {this.renderSelect()}
      </div>
    )
  }

  renderOrganizations() {
    if(this.props.parent.organizationLinks.length) {
      var organizationDivs = _.map(this.props.parent.organizationLinks, (organizationLink) => {
        return this.renderOrganization(organizationLink)
      })

      return (
        <div className="row">
          {organizationDivs}
        </div>
      )
    }
    else {
      return (
        <div className="row">
          <div className="col-md-12">
            Aucune organisation.
          </div>
        </div>
      )
    }
  }

  renderOrganization(organizationLink) {
    return (
      <Organization key={organizationLink.organization.id}
                    organizationLink={organizationLink}
                    canWrite={this.props.canWrite}
                    removeOrganization={this.removeOrganization.bind(this)}
                    linkName={this.props.linkName} />
    )
  }

  renderSelect() {
    if(this.props.canWrite) {
      var filteredOptions = _.reject(this.state.options, (option) => {
        return _.includes(this.organizationIds(), option.value)
      })

      return (
        <div className="select">
          <Select multi={false}
                  options={filteredOptions}
                  placeholder="Ajouter..."
                  onChange={this.addOrganization.bind(this)} />
        </div>
      )
    }
  }
}
