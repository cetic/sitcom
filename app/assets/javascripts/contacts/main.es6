import Contacts       from './index/contacts.es6'
import Contact        from './show/contact.es6'
import NewContact     from './shared/new_contact.es6'
import QuickSearch    from '../shared/quick_search.es6'
import AdvancedSearch from './shared/advanced_search.es6'
import ParamsService  from '../shared/params_service.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'email', 'address', 'phone', 'active',
      'organizationIds', 'fieldIds', 'eventIds', 'projectIds'
    ];

    this.state = {
      contacts: [],
      loaded:   false,
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
    $('.quick-search input').focus()
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
    var params = _.assign({}, this.buildFilterParams(), {
      offset: offset
    });

    http.get(this.props.contactsPath, params, (data) => {
      this.setState({
        contacts: offset == 0 ? data.contacts : this.state.contacts.concat(data.contacts),
        loaded:   true,
      });
    });
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues);
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push('contacts?' + paramsString);
  }

  updateQuickSearch(newQuickSearch) {
    this.dUpdateUrl({
      quickSearch: newQuickSearch
    });
  }

  updateAdvancedSearchFilters(newFilters) {
    this.dUpdateUrl(newFilters);
  }

  openNewContactModal() {
    $('.new-contact-modal').modal('show');
  }

  render() {
    var advancedSearchFilters = _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
      return this.props.location.query[filterName];
    }));

    return (
      <div className="container-fluid container-contact">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <AdvancedSearch filters={advancedSearchFilters}
                            updateAdvancedSearchFilters={this.updateAdvancedSearchFilters.bind(this)}
                            organizationOptionsPath={this.props.organizationOptionsPath}
                            fieldOptionsPath={this.props.fieldOptionsPath}
                            eventOptionsPath={this.props.eventOptionsPath}
                            projectOptionsPath={this.props.projectOptionsPath} />
          </div>

          <div className="col-md-8 col-contacts">
            <QuickSearch quickSearch={this.props.location.query.quickSearch}
                         updateQuickSearch={this.updateQuickSearch.bind(this)} />

            { this.renderNewContactLink() }

            { this.renderContact()  }
            { this.renderContacts() }
          </div>
        </div>

        { this.renderNewContactModal() }
      </div>
    );
  }

  renderNewContactLink() {
    return (
      <button className="btn btn-primary new"
              onClick={this.openNewContactModal.bind(this)}>
        Nouveau contact
      </button>
    )
  }

  renderContacts() {
    if(!this.props.params.id) {
      return (
        <Contacts contacts={this.state.contacts}
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
