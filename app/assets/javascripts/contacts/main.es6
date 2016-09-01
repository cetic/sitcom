import Contacts               from './index/contacts.es6'
import Contact                from './show/contact.es6'
import NewContact             from './shared/new_contact.es6'
import QuickSearch            from '../shared/quick_search.es6'
import AdvancedSearch         from './shared/advanced_search.es6'
import ParamsService          from '../shared/params_service.es6'
import PreviousNextNavService from '../shared/previous_next_nav_service.es6'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'email', 'address', 'phone', 'active',
      'organizationIds', 'fieldIds', 'eventIds', 'projectIds'
    ];

    this.state = {
      contacts:        [],
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

  reloadFromBackend(offset = 0, callback) {
      var params = _.assign({}, this.buildFilterParams(), {
        offset: offset
      });

      http.get(this.props.contactsPath, params, (data) => {
        this.setState({
          contacts:        offset == 0 ? data.contacts : this.state.contacts.concat(data.contacts),
          loaded:          true,
          infiniteLoaded:  true,
          infiniteEnabled: data.contacts.length == window.infiniteScrollStep // no more results
        }, callback);
      });
    }

  loadNextBatchFromBackend(callback) {
    this.setState({ infiniteLoaded: false }, () => {
      this.dReloadFromBackend(this.state.contacts.length, callback);
    })
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

  getCurrentIndex() {
    return PreviousNextNavService.getCurrentIndex(
      this.state.contacts,
      this.props.params.id
    )
  }

  gotoNext() {
    return PreviousNextNavService.gotoNext(
      this.state.contacts,
      this.props.params.id,
      this.props.router
    )
  }

  gotoPrevious() {
    return PreviousNextNavService.gotoPrevious(
      this.state.contacts,
      this.props.params.id,
      this.props.router
    )
  }

  hasPrevious() {
    return PreviousNextNavService.hasPrevious(
      this.state.contacts,
      this.props.params.id
    )
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

          <div className="col-md-8">
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
                  loadingImagePath={this.props.loadingImagePath}
                  infiniteEnabled={this.state.infiniteEnabled}
                  infiniteScrollOffset={this.state.infiniteScrollOffset}
                  infiniteLoaded={this.state.infiniteLoaded}
                  loadNextBatchFromBackend={this.loadNextBatchFromBackend.bind(this)} />
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
                 gotoNext={this.gotoNext.bind(this)}
                 gotoPrevious={this.gotoPrevious.bind(this)}
                 hasPrevious={this.hasPrevious()} />
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
