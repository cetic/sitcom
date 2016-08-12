import Contact        from './contact.js.jsx'
import QuickSearch    from './quick_search.js.jsx'
import CompleteSearch from './complete_search.js.jsx'

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts:       [],
      loading:        true,
      quickSearch:    '',
      completeSearch: {}
    };
  }

  componentDidMount() {
    this.reloadFromBackend();
  }

  reloadFromBackend() {
    $.get(this.props.route.contactsPath, { query: this.state.quickSearch }, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        contacts: camelData.contacts,
        loading:  false
      });
    });
  }

  updateQuickSearch(newQuickSearch) {
    this.setState({
      quickSearch: newQuickSearch
    }, this.reloadFromBackend)
  }

  render() {
    return (
      <div className="container-fluid container-contact-index">
        <div className="row">
          <div className="col-md-4 pull-right complete-search">
            <CompleteSearch completeSearch={this.state.completeSearch} />
          </div>

          <div className="col-md-8">
            <QuickSearch quickSearch={this.state.quickSearch}
                         updateQuickSearch={this.updateQuickSearch.bind(this)} />

            <div className="contacts">
              {this.renderContacts()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContacts() {
    return _.map(this.state.contacts, (contact) => {
      return (
        <Contact key={contact.id} contact={contact} />
      );
    });
  }
}

module.exports = Contacts
