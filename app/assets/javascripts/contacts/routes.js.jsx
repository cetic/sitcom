import { useBasename, createHistory } from 'history'
import { useRouterHistory           } from 'react-router'
import { withRouter                 } from 'react-router'

import Contacts from './index/contacts.js.jsx'
import Contact  from './show/contact.js.jsx'

var ContactsWithRouter = withRouter(Contacts)
var ContactWithRouter  = withRouter(Contact)

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.contactsPath
    });
  }

  contactsWrapper() {
    var routesComponent = this

    return class extends React.Component {
      render() {
        return (
          <ContactsWithRouter {...this.props} contactsPath={routesComponent.props.contactsPath}
                                              loadingImagePath={routesComponent.props.loadingImagePath} />
        );
      }
    }
  }

  contactWrapper() {
    var routesComponent = this

    return class extends React.Component {
      render() {
        return (
          <ContactWithRouter {...this.props} contactsPath={routesComponent.props.contactsPath} />
        );
      }
    }
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/"    component={this.contactsWrapper()} />
        <Route path="/:id" component={this.contactWrapper()} />
      </Router>
    );
  }
}

module.exports = Routes
