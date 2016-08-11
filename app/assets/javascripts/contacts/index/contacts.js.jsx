import Contact     from './contact.js.jsx'
import QuickSearch from './quick_search.js.jsx'

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      booted: false,
      loading: true
    };
  }

  componentDidMount() {
    this.reloadFromBackend();
  }

  reloadFromBackend() {
    $.get(this.props.route.contactsPath, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        contacts: camelData.contacts,
        booted: true,
        loading: false
      });
    });
  }

  render() {
    return (
      <div className="container-fluid container-contact-index">
        <div className="row">
          <div className="col-md-4 pull-right" style={{ height: '400px', backgroundColor: 'white' }}>
            Recherche avancée
          </div>

          <div className="col-md-8">
            <QuickSearch />

            <div className="contacts">
              {this.renderContacts()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContacts() {
    return _.map(this.state.contacts, function(contact) {
      return (
        <Contact key={contact.id} contact={contact} />
      );
    });
  }
}

module.exports = Contacts
