import Project  from './project.es6'
import Infinite from 'react-infinite'

class Projects extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="projects items">
        { this.renderProjectsContainer() }
      </div>
    )
  }

  renderProjectsContainer() {
    if(!this.props.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
    else if(this.props.projects.length == 0) {
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
          { this.renderProjects() }
        </Infinite>
      )
    }
  }

  renderProjects() {
    return _.map(this.props.projects, (project) => {
      var selected = _.includes(this.props.selectedItemIds, project.id)

      return (
        <Project key={project.id}
                 permissions={this.props.permissions}
                 project={project}
                 search={this.props.search}
                 tagOptionsPath={this.props.tagOptionsPath}
                 selected={selected}
                 updateSelected={this.props.updateSelected}
                 pushTagIdsFilter={this.props.pushTagIdsFilter} />
      )
    })
  }
}

module.exports = Projects
