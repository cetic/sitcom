import Contact        from './contact.js.jsx'
import QuickSearch    from './quick_search.js.jsx'
import CompleteSearch from './complete_search.js.jsx'

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts:       [],
      loaded:         false,
      completeSearch: {},

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
    $.get(this.props.route.contactsPath, { query: this.props.location.query.quickSearch, offset: offset }, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        contacts:        offset == 0 ? camelData.contacts : this.state.contacts.concat(camelData.contacts),
        loaded:          true,
        infiniteLoaded:  true,
        infiniteEnabled: camelData.contacts.length == 30 // no more results
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

  updateQuickSearch(newQuickSearch) {
    this.props.router.push('?quickSearch=' + newQuickSearch)
  }

  render() {
    return (
      <div className="container-fluid container-contact-index">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <CompleteSearch completeSearch={this.state.completeSearch} />
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
          <img src={this.props.route.loadingImagePath}/>
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
          <img src={this.props.route.loadingImagePath}/>
        </div>
      );
    }
  }
}

module.exports = Contacts
