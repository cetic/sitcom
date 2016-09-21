import Contacts         from './index/contacts.es6'
import Contact          from './show/contact.es6'
import NewContact       from './shared/new_contact.es6'
import QuickSearch      from '../shared/quick_search.es6'
import AdvancedSearch   from './shared/advanced_search.es6'
import ParamsService    from '../shared/params_service.es6'
import PermissionDenied from '../shared/permission_denied.es6'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      contacts: [],
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
    $('.nav.sections li.contacts').addClass('selected')
  }

  getFilters() {
    return {
      quickSearch:     this.props.location.query.quickSearch      || '',
      name:            this.props.location.query.name             || '',
      email:           this.props.location.query.email            || '',
      address:         this.props.location.query.address          || '',
      phone:           this.props.location.query.phone            || '',
      notes:           this.props.location.query.notes            || '',
      active:          this.props.location.query.active           || '',
      organizationIds: this.props.location.query.organizationIds,
      fieldIds:        this.props.location.query.fieldIds,
      eventIds:        this.props.location.query.eventIds,
      projectIds:      this.props.location.query.projectIds,
    }
  }

  reloadFromBackend(spinner = true) {
    if(spinner) {
      this.setState({ loaded: false })
    }

    http.get(this.props.contactsPath, this.getFilters(), (data) => {
      this.setState({
        contacts: data.contacts,
        loaded:   true,
      })
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues)
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('contacts?' + paramsString)
  }

  updateQuickSearch(newQuickSearch) {
    this.updateFilters({
      quickSearch: newQuickSearch
    })
  }

  updateFilters(newFilters) {
    this.updateUrl(newFilters)
  }

  openNewContactModal() {
    $('.new-contact-modal').modal('show')
  }

  render() {
    if(this.props.permissions.canReadContacts) {
      var filters = this.getFilters()

      return (
        <div className="container-fluid container-contact">
          <div className="row">
            <div className="col-md-4 pull-right complete-search">
              <AdvancedSearch filters={filters}
                              updateFilters={this.updateFilters.bind(this)}
                              organizationOptionsPath={this.props.organizationOptionsPath}
                              fieldOptionsPath={this.props.fieldOptionsPath}
                              eventOptionsPath={this.props.eventOptionsPath}
                              projectOptionsPath={this.props.projectOptionsPath} />
            </div>

            <div className="col-md-8 col-contacts">
              <QuickSearch title="Contacts"
                           loaded={this.state.loaded}
                           results={this.state.contacts.length}
                           quickSearch={filters.quickSearch}
                           updateQuickSearch={this.updateQuickSearch.bind(this)}
                           filters={filters}
                           exportUrl={this.props.contactsPath + '/export'} />

              { this.renderNewContactLink() }

              { this.renderContact()  }
              { this.renderContacts() }
            </div>
          </div>

          { this.renderNewContactModal() }
        </div>
      )
    }
    else {
      return (
        <PermissionDenied />
      )
    }
  }

  renderNewContactLink() {
    if(this.props.permissions.canWriteContacts) {
      return (
        <button className="btn btn-primary new"
                onClick={this.openNewContactModal.bind(this)}>
          Nouveau contact
        </button>
      )
    }
  }

  renderContacts() {
    if(!this.props.params.id) {
      return (
        <Contacts permissions={this.props.permissions}
                  contacts={this.state.contacts}
                  loaded={this.state.loaded}
                  search={this.props.location.search}
                  loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }

  renderContact() {
    if(this.props.params.id) {
      return (
        <Contact id={this.props.params.id}
                 permissions={this.props.permissions}
                 loaded={this.state.loaded}
                 contactsPath={this.props.contactsPath}
                 search={this.props.location.search}
                 loadingImagePath={this.props.loadingImagePath}
                 organizationOptionsPath={this.props.organizationOptionsPath}
                 fieldOptionsPath={this.props.fieldOptionsPath}
                 eventOptionsPath={this.props.eventOptionsPath}
                 projectOptionsPath={this.props.projectOptionsPath}
                 contacts={this.state.contacts}
                 router={this.props.router}
                 reloadIndexFromBackend={this.reloadFromBackend.bind(this)} />
      )
    }
  }

  renderNewContactModal() {
    return (
      <NewContact reloadFromBackend={this.reloadFromBackend.bind(this)}
                  contactsPath={this.props.contactsPath}
                  router={this.props.router} />
    )
  }
}

module.exports = Main
