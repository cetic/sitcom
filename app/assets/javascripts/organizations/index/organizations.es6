import Organization from './organization.es6'
import Infinite     from 'react-infinite'

class Organizations extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="organizations items">
        { this.renderOrganizationsContainer() }
      </div>
    )
  }

  renderOrganizationsContainer() {
    if(!this.props.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
    else if(this.props.organizations.length == 0) {
      return (
        <div className="blank-slate">
          Aucun résultat
        </div>
      )
    }
    else {
      return (
        <Infinite useWindowAsScrollContainer
                  elementHeight={84}>
          { this.renderOrganizations() }
        </Infinite>
      )
    }
  }

  renderOrganizations() {
    return _.map(this.props.organizations, (organization) => {
      var selected = _.includes(this.props.selectedItemIds, organization.id)

      return (
        <Organization key={organization.id}
                      permissions={this.props.permissions}
                      organization={organization}
                      search={this.props.search}
                      tagOptionsPath={this.props.tagOptionsPath}
                      selected={selected}
                      updateSelected={this.props.updateSelected}
                      pushTagIdsFilter={this.props.pushTagIdsFilter} />
      )
    })
  }
}

module.exports = Organizations
