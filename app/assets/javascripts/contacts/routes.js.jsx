import { useBasename, createHistory } from 'history'
import { useRouterHistory           } from 'react-router'
import { withRouter                 } from 'react-router'

import Contacts from './index/contacts.js.jsx'
import Contact  from './show/contact.js.jsx'

var ContactsWithRouter = withRouter(Contacts)
var ContactWithRouter  = withRouter(Contact)

// We want to access props in this.props and not in this.props.route (but it's just a personal choice)
var mergePropsRouteInProps = (props) => {
  var cleanedPropsRoute = _.omit(props.route, ['component', 'path']);
  return _.merge({}, props, cleanedPropsRoute);
}

const ContactsWrapper = (props) => {
  return ( <ContactsWithRouter {...mergePropsRouteInProps(props)} /> );
}

const ContactWrapper = (props) => {
  return ( <ContactWithRouter {...mergePropsRouteInProps(props)} /> );
}

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.contactsPath
    });
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/" component={ContactsWrapper}
                        contactsPath={this.props.contactsPath}
                        organizationOptionsPath={this.props.organizationOptionsPath}
                        fieldOptionsPath={this.props.fieldOptionsPath}
                        eventOptionsPath={this.props.eventOptionsPath}
                        projectOptionsPath={this.props.projectOptionsPath}
                        loadingImagePath={this.props.loadingImagePath}>
          <Route path=":id" component={ContactsWrapper} />
        </Route>
      </Router>
    );
  }
}

module.exports = Routes
