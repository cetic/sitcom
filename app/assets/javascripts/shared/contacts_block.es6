import Select from 'react-select'

class ContactsBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      options: []
    }
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    http.get(this.props.optionsPath, {}, (data) => {
      this.setState({
        options: data
      })
    })
  }

  removeContact(contact) {
    if(confirm("Délier ce contact ?")) {
      var contactIds = _.filter(this.props.parent.contactIds, (contactId) => {
        return contactId != contact.id
      })

      this.saveOnBackend(contactIds)
    }
  }

  addContact(option) {
    this.saveOnBackend(
      _.uniq(_.concat(this.props.parent.contactIds, option.value))
    )
  }

  saveOnBackend(contactIds) {
    // [''] is a way for the rails server to keep the empty array
    var ids = contactIds.length ? contactIds : ['']

    var params = {}
    params[this.props.parentType]            = {}
    params[this.props.parentType].contactIds = ids

    http.put(this.props.parentPath, params)
  }

  render() {
    return (
      <div className="associations-block contacts-block">
        <div className="row">
          <div className="col-md-12">
            <h3>Contacts ({this.props.parent.contacts.length})</h3>
          </div>
        </div>

        {this.renderContacts()}
        {this.renderSelect()}
      </div>
    )
  }

  renderContacts() {
    if(this.props.parent.contacts.length) {
      var contactDivs = _.map(this.props.parent.contacts, (contact) => {
        return this.renderItem(contact)
      })

      return (
        <div className="row">
          {contactDivs}
        </div>
      )
    }
    else {
      return (
        <div className="row">
          <div className="col-md-12">
            Aucun contact.
          </div>
        </div>
      )
    }
  }

  renderItem(contact) {
    return (
      <div className="col-md-6 association contact" key={contact.id}>
        <div className="association-inside">
          <img className="img-thumbnail" src={contact.thumbPictureUrl} />
          <h4>
            <Link to={contact.scopedPath}>{contact.name}</Link>
          </h4>

          {this.renderRemoveIcon(contact)}
        </div>
      </div>
    )
  }

  renderRemoveIcon(contact) {
    if(this.props.canWrite) {
      return (
        <i className="fa fa-times remove-icon"
           onClick={this.removeContact.bind(this, contact)}>
        </i>
      )
    }
  }

  renderSelect() {
    if(this.props.canWrite) {
      var filteredOptions = _.reject(this.state.options, (option) => {
        return _.includes(this.props.parent.contactIds, option.value)
      })

      return (
        <div className="select">
          <Select multi={false}
                  options={filteredOptions}
                  placeholder="Ajouter..."
                  onChange={this.addContact.bind(this)} />
        </div>
      )
    }
  }

}

module.exports = ContactsBlock
