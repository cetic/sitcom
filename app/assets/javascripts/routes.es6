import { createHistory }                from 'history'
import { useRouterHistory, withRouter } from 'react-router'

import Contacts      from './contacts/main.es6'
import Organizations from './organizations/main.es6'
import Projects      from './projects/main.es6'
import Events        from './events/main.es6'

var ContactsWithRouter      = withRouter(Contacts)
var OrganizationsWithRouter = withRouter(Organizations)
var ProjectsWithRouter      = withRouter(Projects)
var EventsWithRouter        = withRouter(Events)

// We want to access props in this.props and not in this.props.route (but it's just a personal choice)
global.mergePropsRouteInProps = (props) => {
  var cleanedPropsRoute = _.omit(props.route, ['component', 'path']);
  return _.merge({}, props, cleanedPropsRoute);
}

const ContactsWrapper      = (props) => { return ( <ContactsWithRouter {...mergePropsRouteInProps(props)} /> ); }
const OrganizationsWrapper = (props) => { return ( <OrganizationsWithRouter {...mergePropsRouteInProps(props)} /> ); }
const ProjectsWrapper      = (props) => { return ( <ProjectsWithRouter {...mergePropsRouteInProps(props)} /> ); }
const EventsWrapper        = (props) => { return ( <EventsWithRouter {...mergePropsRouteInProps(props)} /> ); }

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.labPath
    });
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/contacts" component={ContactsWrapper}
                                contactsPath={this.props.contactsPath}
                                organizationOptionsPath={this.props.organizationOptionsPath}
                                fieldOptionsPath={this.props.fieldOptionsPath}
                                eventOptionsPath={this.props.eventOptionsPath}
                                projectOptionsPath={this.props.projectOptionsPath}
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={ContactsWrapper} />
        </Route>

        <Route path="/organizations" component={OrganizationsWrapper}
                                     organizationsPath={this.props.organizationsPath}
                                     contactOptionsPath={this.props.contactOptionsPath}
                                     loadingImagePath={this.props.loadingImagePath}
                                     organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath}>

          <Route path=":id" component={OrganizationsWrapper} />
        </Route>

        <Route path="/projects" component={ProjectsWrapper}
                                projectsPath={this.props.projectsPath}
                                contactOptionsPath={this.props.contactOptionsPath}
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={ProjectsWrapper} />
        </Route>

        <Route path="/events" component={EventsWrapper}
                              eventsPath={this.props.eventsPath}
                              contactOptionsPath={this.props.contactOptionsPath}
                              loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={EventsWrapper} />
        </Route>
      </Router>
    );
  }
}

module.exports = Routes
