import BaseMain       from '../shared/base/base_main.es6'
import Projects       from './index/projects.es6'
import Project        from './show/project.es6'
import NewItem        from '../shared/new_item.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import SavedSearches  from '../shared/saved_searches.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.title          = 'Projets'
    this.itemType       = 'project'
    this.newButtonLabel = 'Nouveau projet'
    this.SavedSearches  = SavedSearches
    this.AdvancedSearch = AdvancedSearch

    this.state = {
      projects: [],
      loaded:   false,
    }
  }

  getFilters() {
    return {
      quickSearch: this.props.location.query.quickSearch || '',
      name:        this.props.location.query.name        || '',
      description: this.props.location.query.description || '',
      notes:       this.props.location.query.notes       || '',
      contactIds:  this.props.location.query.contactIds,
    }
  }

  renderItems() {
    return (
      <Projects projects={this.state.projects}
                loaded={this.state.loaded}
                search={this.props.location.search}
                loadingImagePath={this.props.route.loadingImagePath} />
    )
  }

  renderItem() {
    var urlProjectId = parseInt(this.props.params.id)
    var project      = _.find(this.state.projects, (project) => { return project.id == urlProjectId } )

    return (
      <Project id={urlProjectId}
               project={project}
               permissions={this.props.route.permissions}
               currentUserId={this.props.route.currentUserId}
               labId={this.props.route.labId}
               loaded={this.state.loaded}
               projectsPath={this.props.route.projectsPath}
               search={this.props.location.search}
               loadingImagePath={this.props.route.loadingImagePath}
               contactOptionsPath={this.props.route.contactOptionsPath}
               projects={this.state.projects}
               router={this.props.router} />
    )
  }

  renderNewModal() {
    return (
      <NewItem itemsPath={this.props.route.projectsPath}
               router={this.props.router}
               modalClassName="new-project-modal"
               modalTitle="Nouveau projet"
               modelName="project"
               fieldName="name"
               fieldTitle="Nom" />
    )
  }
}

module.exports = Main
