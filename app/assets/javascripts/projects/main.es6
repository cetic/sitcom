import BaseMain         from '../shared/base/base_main.es6'
import Projects         from './index/projects.es6'
import Project          from './show/project.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import SavedSearches    from '../shared/saved_searches.es6'

class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.itemType       = 'project'
    this.newButtonLabel = 'Nouveau projet'

    this.state = {
      projects: [],
      loaded:   false,
    }
  }

  getFilters() {
    return {
      quickSearch:  this.props.location.query.quickSearch || '',
      name:         this.props.location.query.name        || '',
      description:  this.props.location.query.description || '',
      notes:        this.props.location.query.notes       || '',
      contactIds:   this.props.location.query.contactIds,
    }
  }

  renderSavedSearches() {
    return(
      <SavedSearches router={this.props.router}
                     search={this.props.location.search}
                     itemType="project"
                     savedSearchesPath={`${this.props.projectsPath}/saved_searches`} />
    )
  }

  renderAdvancedSearch(filters) {
    return (
      <AdvancedSearch filters={filters}
                      contactOptionsPath={this.props.contactOptionsPath}
                      updateFilters={this.updateFilters.bind(this)} />
    )
  }

  renderQuickSearch(filters) {
    return (
      <QuickSearch title="Projets"
                   loaded={this.state.loaded}
                   results={this.state.projects.length}
                   quickSearch={filters.quickSearch}
                   updateQuickSearch={this.updateQuickSearch.bind(this)} />
    )
  }

  renderItems() {
    return (
      <Projects projects={this.state.projects}
                loaded={this.state.loaded}
                search={this.props.location.search}
                loadingImagePath={this.props.loadingImagePath} />
    )
  }

  renderItem() {
    return (
      <Project id={this.props.params.id}
               permissions={this.props.permissions}
               loaded={this.state.loaded}
               projectsPath={this.props.projectsPath}
               search={this.props.location.search}
               loadingImagePath={this.props.loadingImagePath}
               contactOptionsPath={this.props.contactOptionsPath}
               reloadIndexFromBackend={this.reloadFromBackend.bind(this)}
               projects={this.state.projects}
               router={this.props.router} />
    )
  }

  renderNewModal() {
    return (
      <NewItem reloadFromBackend={this.reloadFromBackend.bind(this)}
               itemsPath={this.props.projectsPath}
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
