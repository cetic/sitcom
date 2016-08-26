import Projects       from './index/projects.es6'
import Project        from './show/project.es6'
import NewItem        from '../shared/new_item.es6'
import QuickSearch    from '../shared/quick_search.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import ParamsService  from '../shared/params_service.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'description'
    ];

    this.state = {
      projects:        [],
      loaded:          false,
      infiniteLoaded:  true,
      infiniteEnabled: true,
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.filtersHaveChanged(prevProps)) {
      this.reloadFromBackend();
    }
  }

  filtersHaveChanged(prevProps) {
    return _.some(this.filterNames, (filterName) => {
      return prevProps.location.query[filterName] != this.props.location.query[filterName];
    });
  }

  buildFilterParams() {
    return _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
      return this.props.location.query[filterName];
    }));
  }

  reloadFromBackend(offset = 0) {
    var params = humps.decamelizeKeys(_.assign({}, this.buildFilterParams(), {
      offset: offset
    }));

    $.get(this.props.projectsPath, params, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        projects:        offset == 0 ? camelData.projects : this.state.projects.concat(camelData.projects),
        loaded:          true,
        infiniteLoaded:  true,
        infiniteEnabled: camelData.projects.length == window.infiniteScrollStep // no more results
      });
    });
  }

  loadNextBatchFromBackend() {
    this.setState({ infiniteLoaded: false }, () => {
      this.dReloadFromBackend(this.state.projects.length);
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues);
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('?' + paramsString);
  }

  updateQuickSearch(newQuickSearch) {
    this.dUpdateUrl({
      quickSearch: newQuickSearch
    });
  }

  updateAdvancedSearchFilters(newFilters) {
    this.dUpdateUrl(newFilters);
  }

  openNewProjectModal() {
    $('.new-project-modal').modal('show')
  }

  render() {
    var advancedSearchFilters = _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
      return this.props.location.query[filterName];
    }));

    return (
      <div className="container-fluid container-project">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <AdvancedSearch filters={advancedSearchFilters}
                            updateAdvancedSearchFilters={this.updateAdvancedSearchFilters.bind(this)} />
          </div>

          <div className="col-md-8">
            <QuickSearch quickSearch={this.props.location.query.quickSearch}
                         updateQuickSearch={this.updateQuickSearch.bind(this)} />

            { this.renderNewProjectLink() }

            { this.renderProject()  }
            { this.renderProjects() }
          </div>
        </div>

        { this.renderNewProjectModal() }
      </div>
    );
  }

  renderNewProjectLink() {
    return (
      <button className="btn btn-primary new"
              onClick={this.openNewProjectModal.bind(this)}>
        Nouveau projet
      </button>
    )
  }

  renderProjects() {
    if(!this.props.params.id) {
      return (
        <Projects projects={this.state.projects}
                       loaded={this.state.loaded}
                       search={this.props.location.search}
                       loadingImagePath={this.props.loadingImagePath}
                       infiniteEnabled={this.state.infiniteEnabled}
                       infiniteScrollOffset={this.state.infiniteScrollOffset}
                       infiniteLoaded={this.state.infiniteLoaded}
                       loadNextBatchFromBackend={this.loadNextBatchFromBackend.bind(this)} />
      )
    }
  }

  renderProject() {
    if(this.props.params.id) {
      return (
        <Project id={this.props.params.id}
                      projectsPath={this.props.projectsPath}
                      search={this.props.location.search}
                      loadingImagePath={this.props.loadingImagePath}
                      contactOptionsPath={this.props.contactOptionsPath} />
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
