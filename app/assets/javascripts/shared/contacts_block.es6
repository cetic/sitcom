import Select from 'react-select'

class ContactsBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    $.get(this.props.optionsPath, (data) => {
      var camelData = humps.camelizeKeys(data);

      this.setState({
        options: camelData
      });
    });
  }

  removeContact(contact) {
    if(confirm("Délier ce contact ?")) {
      var contactIds = _.filter(this.props.parent.contactIds, (contactId) => {
        return contactId != contact.id;
      });

      this.saveOnBackend(contactIds);
    }
  }

  addContact(option) {
    this.saveOnBackend(
      _.uniq(_.concat(this.props.parent.contactIds, option.value))
    );
  }

  saveOnBackend(contactIds) {
    var params = {
      _method: 'PUT',
    };

    // [''] is a way for the rails server to keep the empty array
    var contactIds = contactIds.length ? contactIds : [''];

    params[this.props.parentType]            = {};
    params[this.props.parentType].contactIds = contactIds;

    $.post(this.props.parentPath, humps.decamelizeKeys(params), () => {
      this.props.reloadFromBackend();
    });
  }

  render() {
    return (
      <div className="contacts-block">
        <h3>Contacts ({this.props.parent.contacts.length})</h3>
        {this.renderContacts()}
        {this.renderSelect()}
      </div>
    );
  }

  renderContacts() {
    if(this.props.parent.contacts.length) {
      var contactDivs = _.map(this.props.parent.contacts, (contact) => {
        return this.renderItem(contact);
      });

      return (
        <div className="row">
          {contactDivs}
        </div>
      )
    }
    else {
      return (
        <div className="row">
          {this.props.emptyMessage}
        </div>
      )
    }
  }

  renderItem(contact) {
    return (
      <div className="col-md-6 contact" key={contact.id}>
        <img className="img-thumbnail" src={contact.pictureUrl} />
        <h4>{contact.name}</h4>

        <i className="fa fa-times remove-icon"
           onClick={this.removeContact.bind(this, contact)}>
        </i>
      </div>
    )
  }

  renderSelect() {
    var filteredOptions = _.reject(this.state.options, (option) => {
      return _.includes(this.props.parent.contactIds, option.value);
    })

    return (
      <div className="select">
        <Select multi={false}
                options={filteredOptions}
                placeholder="Ajouter..."
                onChange={this.addContact.bind(this)} />
      </div>
    );
  }

}

module.exports = ContactsBlock
