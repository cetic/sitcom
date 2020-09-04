import Select from 'react-select'

import Contact from './contacts_block/contact.jsx'

export default class ContactsBlock extends React.Component {

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
    if(confirm(this.props.removeConfirmMessage)) {
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

  mailtoLink() {
    let emails = _.map(this.props.parent.contactLinks, (contactLink) => {
      return contactLink.contact.email
    })

    emails = _.reject(emails, (email) => { !email || email.length == 0 })

    return `mailto:?bcc=${emails.join(',')}&subject=${this.props.parent.name}`
  }

  exportLink() {
    let ids = _.map(this.props.parent.contactLinks, (contactLink) => {
      return contactLink.contact.id
    })

    let splitted = this.props.optionsPath.split('/')
    splitted.pop()

    return `${splitted.join('/')}/export?ids=${ids.join(',')}`
  }

  render() {
    return (
      <div className="associations-block contacts-block">
        { this.renderContactActions() }

        <div className="row">
          <div className="col-md-12">
            <h3>Contacts ({this.props.parent.contactLinks.length})</h3>
          </div>
        </div>

        {this.renderContacts()}
        {this.renderSelect()}
      </div>
    )
  }

  renderContactActions() {
    if(this.props.parent.contactLinks.length) {
      return (
        <div className="contact-actions">
          <a href={this.mailtoLink()} target="_blank">
            <i className="fa fa-envelope-o"></i>
          </a>
          <a href={this.exportLink()} target="_blank">
            <i className="fa fa-file-excel-o"></i>
          </a>
        </div>
      )
    }
  }

  renderContacts() {
    if(this.props.parent.contactLinks.length) {
      var contactDivs = _.map(this.props.parent.contactLinks, (contactLink) => {
        return this.renderContact(contactLink)
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

  renderContact(contactLink) {
    return (
      <Contact key={contactLink.contact.id}
               contactLink={contactLink}
               canWrite={this.props.canWrite}
               removeContact={this.removeContact.bind(this)}
               linkName={this.props.linkName} />
    )
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
