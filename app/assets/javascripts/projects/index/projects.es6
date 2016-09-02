import Project  from './project.es6'
import Infinite from 'react-infinite'

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="projects">
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
                  elementHeight={116}>
          { this.renderProjects() }
        </Infinite>
      )
    }
  }

  renderProjects() {
    return _.map(this.props.projects, (project) => {
      return (
        <Project key={project.id}
                 project={project}
                 search={this.props.search} />
      );
    });
  }
}

module.exports = Projects
