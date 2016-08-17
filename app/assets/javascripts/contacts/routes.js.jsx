import { useBasename, createHistory } from 'history'
import { useRouterHistory           } from 'react-router'
import { withRouter                 } from 'react-router'

import Contacts from './index/contacts.js.jsx'
import Contact  from './show/contact.js.jsx'

var ContactsWrapper = withRouter(Contacts)
var ContactWrapper  = withRouter(Contact)

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.contactsPath
    });
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/"    component={ContactsWrapper} contactsPath={this.props.contactsPath} loadingImagePath={this.props.loadingImagePath} />
        <Route path="/:id" component={ContactWrapper}  contactsPath={this.props.contactsPath} />
      </Router>
    );
  }
}

module.exports = Routes
