import { useBasename, createHistory } from 'history'
import { useRouterHistory }           from 'react-router'

import Contacts from './index/contacts.js.jsx'
import Contact  from './show/contact.js.jsx'

class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.contactsPath
    });
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/"    component={Contacts} contactsPath={this.props.contactsPath} loadingImagePath={this.props.loadingImagePath} />
        <Route path="/:id" component={Contact}  contactsPath={this.props.contactsPath} />
      </Router>
    );
  }
}

module.exports = Routes
