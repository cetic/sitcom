import Contacts       from './index/contacts.es6'
import Contact        from './show/contact.es6'
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
      contacts:        [],
      loaded:          false,
      infiniteLoaded:  true,
      infiniteEnabled: true,

      newContactFirstName: '',
      newContactLastName:  ''
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

    $.get(this.props.contactsPath, params, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        contacts:        offset == 0 ? camelData.contacts : this.state.contacts.concat(camelData.contacts),
        loaded:          true,
        infiniteLoaded:  true,
        infiniteEnabled: camelData.contacts.length == window.infiniteScrollStep // no more results
      });
    });
  }

  loadNextBatchFromBackend() {
    this.setState({ infiniteLoaded: false }, () => {
      this.dReloadFromBackend(this.state.contacts.length);
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

  openNewContactModal() {
    $('.modal').modal('show')
  }

  updateNewContactFirstName(e) {
    this.setState({ newContactFirstName: e.target.value })
  }

  updateNewContactLastName(e) {
    this.setState({ newContactLastName: e.target.value })
  }

  backendCreateNewContactAndRedirect() {
    var params = humps.decamelizeKeys({
      contact: {
        firstName: this.state.newContactFirstName,
        lastName:  this.state.newContactLastName
      }
    });

    $.post(this.props.contactsPath, params, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.props.router.push(camelData.contact.id.toString())
      this.reloadFromBackend()
      $('.modal').modal('hide')
      this.setState({
        newContactFirstName: '',
        newContactLastName:  ''
      })
    });
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

            { this.renderNewContact() }

            { this.renderContact()  }
            { this.renderContacts() }
          </div>
        </div>

        { this.renderNewContactModal() }
      </div>
    );
  }

  renderNewContact() {
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
                 projectOptionsPath={this.props.projectOptionsPath} />
      )
    }
  }

  renderNewContactModal() {
    return (
      <div className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Nouveau contact</h4>
            </div>
            <div className="modal-body">
              <div className="form-horizontal">
                <div className="form-group">
                  <label className="control-label col-md-4" htmlFor="first_name">
                    Prénom
                  </label>
                  <div className="col-md-8">
                    <input value={this.state.newContactFirstName}
                           onChange={this.updateNewContactFirstName.bind(this)}
                           className="form-control"
                           required="required"
                           type="text"
                           id="first_name"/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-4" htmlFor="last_name">
                    Nom
                  </label>
                  <div className="col-md-8">
                    <input value={this.state.newContactLastName}
                           onChange={this.updateNewContactLastName.bind(this)}
                           className="form-control"
                           required="required"
                           type="text"
                           id="last_name"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={this.backendCreateNewContactAndRedirect.bind(this)}>Créer</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Main
