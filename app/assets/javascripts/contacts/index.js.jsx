import Contacts from './index/contacts.js.jsx'

class ContactsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Contacts contactsPath={this.props.contactsPath} />
    );
  }
}

module.exports = ContactsIndex
