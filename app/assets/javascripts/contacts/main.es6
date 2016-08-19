import Contacts       from './index/contacts.es6'
import Contact        from './show/contact.es6'
import QuickSearch    from './shared/quick_search.es6'
import AdvancedSearch from './shared/advanced_search.es6'

class Main extends React.Component {
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

            { this.renderContact()  }
            { this.renderContacts() }
          </div>
        </div>
      </div>
    );
  }

  renderContacts() {
    if(!this.props.params.id) {
      return (
        <Contacts contacts={this.state.contacts}
                  loaded={this.state.loaded}
                  search={this.props.location.search}
                  infiniteLoaded={this.state.infiniteLoaded} />
      )
    }
  }

  renderContact() {
    if(this.props.params.id) {
      return (
        <Contact id={this.props.params.id}
                 contactsPath={this.props.contactsPath}
                 search={this.props.location.search}
                 loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}

module.exports = Main
