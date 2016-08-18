import Contact        from './contact.js.jsx'
import QuickSearch    from './quick_search.js.jsx'
import AdvancedSearch from './advanced_search.js.jsx'

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.filterNames = [
      'quickSearch', 'name', 'email', 'address', 'phone', 'active',
      'organizationIds', 'fieldIds', 'eventIds', 'projectIds'
    ];

    this.state = {
      contacts:             [],
      loaded:               false,
      infiniteLoaded:       true,
      infiniteEnabled:      true,
      infiniteScrollOffset: 200
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
    this.dUpdateUrl         = _.debounce(this.updateUrl, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
    this.bindInfiniteScroll();
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

  bindInfiniteScroll() {
    $(window).scroll(() => {
      if(this.state.infiniteLoaded && this.state.infiniteEnabled && this.state.loaded) {
        if($(window).scrollTop() + $(window).height() >= $(document).height() - this.state.infiniteScrollOffset) {
          var offset = this.state.contacts.length;

          this.setState({ infiniteLoaded: false }, () => {
            this.dReloadFromBackend(offset);
          })
        }
      }
    })
  }

  updateUrl(newValues) {
    var query = _.assign({}, this.props.location.query, newValues);

    if(_.trim(query.quickSearch).length == 0) {
      delete query.quickSearch;
    }

    if(_.trim(query.name).length == 0) {
      delete query.name;
    }

    if(_.trim(query.email).length == 0) {
      delete query.email;
    }

    if(_.trim(query.address).length == 0) {
      delete query.address;
    }

    if(_.trim(query.phone).length == 0) {
      delete query.phone;
    }

    if(_.isUndefined(query.active)) {
      delete query.active;
    }

    if(_.trim(query.organizationIds).length == 0) {
      delete query.organizationIds;
    }

    if(_.trim(query.fieldIds).length == 0) {
      delete query.fieldIds;
    }

    if(_.trim(query.eventIds).length == 0) {
      delete query.eventIds;
    }

    if(_.trim(query.projectIds).length == 0) {
      delete query.projectIds;
    }

    this.props.router.push('?' + $.param(query));
  }

  updateQuickSearch(newQuickSearch) {
    this.dUpdateUrl({
      quickSearch: newQuickSearch
    });
  }

  updateAdvancedSearchFilters(newFilters) {
    this.dUpdateUrl(newFilters);
  }

  render() {
    var advancedSearchFilters = _.zipObject(this.filterNames, _.map(this.filterNames, (filterName) => {
      return this.props.location.query[filterName];
    }));

    return (
      <div className="container-fluid container-contact-index">
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

            <div className="contacts">
              {this.renderContacts()}
              {this.renderInfiniteLoading()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContacts() {
    if(!this.state.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
    else if(this.state.contacts.length == 0) {
      return (
        <div className="blank-slate">
          Aucun résultat
        </div>
      )
    }
    else {
      return _.map(this.state.contacts, (contact) => {
        return (
          <Contact key={contact.id} contact={contact} />
        );
      });
    }
  }

  renderInfiniteLoading() {
    if(!this.state.infiniteLoaded && this.state.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      );
    }
  }
}

module.exports = Contacts
