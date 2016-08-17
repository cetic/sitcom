import Contact        from './contact.js.jsx'
import QuickSearch    from './quick_search.js.jsx'
import AdvancedSearch from './advanced_search.js.jsx'

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      loaded:   false,

      advancedSearchFilters: {
        active: undefined
      },

      infiniteLoaded:       true,
      infiniteEnabled:      true,
      infiniteScrollOffset: 200
    };
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300);
  }

  componentDidMount() {
    this.reloadFromBackend();
    this.bindInfiniteScroll();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.quickSearch != this.props.location.query.quickSearch) {
      this.dReloadFromBackend();
    }
  }

  reloadFromBackend(offset = 0) {
    var params = humps.decamelizeKeys({
      query:  this.props.location.query.quickSearch,
      active: this.props.location.query.active,
      offset: offset
    });

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

    if(_.isUndefined(query.active)) {
      delete query.active;
    }

    this.props.router.push('?' + $.param(query));
  }

  updateQuickSearch(newQuickSearch) {
    this.updateUrl({
      quickSearch: newQuickSearch
    })
  }

  updateAdvancedSearchFilter(filterName, newValue) {
    var newValues = {}
    newValues[filterName] = newValue
    this.updateUrl(newValues)
  }

  render() {
    var advancedSearchFilters = {}

    if(this.props.location.query.active == 'true')
      advancedSearchFilters.active = true

    if(this.props.location.query.active == 'false')
      advancedSearchFilters.active = false

    return (
      <div className="container-fluid container-contact-index">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <AdvancedSearch filters={advancedSearchFilters}
                            updateAdvancedSearchFilter={this.updateAdvancedSearchFilter.bind(this)} />
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
