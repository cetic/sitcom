import BaseMain       from '../shared/base/base_main.jsx'
import Projects       from './index/projects.jsx'
import Project        from './show/project.jsx'
import NewItem        from '../shared/new_item.jsx'
import AdvancedSearch from './shared/advanced_search.jsx'
import SavedSearches  from '../shared/saved_searches.jsx'

export default class Main extends BaseMain {
  constructor(props) {
    super(props)

    this.title          = 'Projets'
    this.itemType       = 'project'
    this.newButtonLabel = 'Nouveau projet'
    this.SavedSearches  = SavedSearches
    this.AdvancedSearch = AdvancedSearch
    this.exportUrl      = `${this.props.route.projectsPath}/export`

    this.state = {
      items:           [],
      filteredItemIds: [],
      filteredCount:   0,
      selectedItemIds: [],
      selectedCount:   0,
      loaded:          false,
    }
  }

  getFilters() {
    var customFieldFilters = {}

    _.each(this.props.route.projectCustomFields, (customField) => {
      customFieldFilters[`customField${customField.id}`] = this.props.location.query[`customField${customField.id}`] || ''
    })

    console.log(this.props.location.query)

    return Object.assign(customFieldFilters, {
      quickSearch:     this.props.location.query.quickSearch || '',
      name:            this.props.location.query.name        || '',
      description:     this.props.location.query.description || '',
      notes:           this.props.location.query.notes       || '',
      from:            this.props.location.query.from        || '',
      to:              this.props.location.query.to          || '',
      contactIds:      this.props.location.query.contactIds,
      organizationIds: this.props.location.query.organizationIds,
      eventIds:        this.props.location.query.projectIds,
      tagIds:          this.props.location.query.tagIds,
    })
  }

  renderItems() {
    return (
      <Projects permissions={this.props.route.permissions}
                projects={this.filteredItems()}
                selectedItemIds={this.state.selectedItemIds}
                loaded={this.state.loaded}
                search={this.props.location.search}
                tagOptionsPath={this.props.route.tagOptionsPath}
                loadingImagePath={this.props.route.loadingImagePath}
                updateSelected={this.updateSelected.bind(this)}
                pushTagIdsFilter={this.pushIdsListFilter.bind(this, 'tagIds')} />
    )
  }

  renderItem() {
    var urlItemId = parseInt(this.props.params.id)
    var item      = _.find(this.state.items, (item) => { return item.id == urlItemId })

    return (
      <Project id={urlItemId}
               project={item}
               permissions={this.props.route.permissions}
               currentUserId={this.props.route.currentUserId}
               labId={this.props.route.labId}
               loaded={this.state.loaded}
               projectsPath={this.props.route.projectsPath}
               search={this.props.location.search}
               loadingImagePath={this.props.route.loadingImagePath}
               tagOptionsPath={this.props.route.tagOptionsPath}
               contactOptionsPath={this.props.route.contactOptionsPath}
               organizationOptionsPath={this.props.route.organizationOptionsPath}
               eventOptionsPath={this.props.route.eventOptionsPath}
               projects={this.filteredItems()}
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
