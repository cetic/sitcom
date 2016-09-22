import Projects         from './index/projects.es6'
import Project          from './show/project.es6'
import NewItem          from '../shared/new_item.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import ParamsService    from '../shared/params_service.es6'
import PermissionDenied from '../shared/permission_denied.es6'
import SavedSearches    from '../shared/saved_searches.es6'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      projects: [],
      loaded:   false,
    }
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300)
  }

  componentDidMount() {
    this.reloadFromBackend()
    this.selectHeaderMenu()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.location.search != this.props.location.search) {
      this.dReloadFromBackend()
    }
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $('.nav.sections li.projects').addClass('selected')
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

  reloadFromBackend(spinner = true) {
    if(spinner) {
      this.setState({ loaded: false })
    }

    http.get(this.props.projectsPath, this.getFilters(), (data) => {
      this.setState({
        projects: data.projects,
        loaded:   true,
      })
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues)
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('projects?' + paramsString)
  }

  updateQuickSearch(newQuickSearch) {
    this.updateFilters({
      quickSearch: newQuickSearch
    })
  }

  updateFilters(newFilters) {
    this.updateUrl(newFilters)
  }

  openNewProjectModal() {
    $('.new-project-modal').modal('show')
  }

  render() {
    if(this.props.permissions.canReadProjects) {
      var filters = this.getFilters()

      return (
        <div className="container-fluid container-project">
          <div className="row">
            <div className="col-md-4 pull-right right-sidebar">
              <SavedSearches router={this.props.router}
                             search={this.props.location.search}
                             itemType="project"
                             savedSearchesPath={`${this.props.projectsPath}/saved_searches`} />

              <AdvancedSearch filters={filters}
                              contactOptionsPath={this.props.contactOptionsPath}
                              updateFilters={this.updateFilters.bind(this)} />
            </div>

            <div className="col-md-8 col-projects">
              <QuickSearch title="Projets"
                           loaded={this.state.loaded}
                           results={this.state.projects.length}
                           quickSearch={filters.quickSearch}
                           updateQuickSearch={this.updateQuickSearch.bind(this)} />

              { this.renderNewProjectLink() }

              { this.renderProject()  }
              { this.renderProjects() }
            </div>
          </div>

          { this.renderNewProjectModal() }
        </div>
      )
    }
    else {
      return (
        <PermissionDenied />
      )
    }
  }

  renderNewProjectLink() {
    if(this.props.permissions.canWriteProjects) {
      return (
        <button className="btn btn-primary new"
                onClick={this.openNewProjectModal.bind(this)}>
          Nouveau projet
        </button>
      )
    }
  }

  renderProjects() {
    if(!this.props.params.id) {
      return (
        <Projects projects={this.state.projects}
                  loaded={this.state.loaded}
                  search={this.props.location.search}
                  loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }

  renderProject() {
    if(this.props.params.id) {
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
  }

  renderNewProjectModal() {
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
