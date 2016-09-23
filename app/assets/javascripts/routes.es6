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
  var cleanedPropsRoute = _.omit(props.route, ['component', 'path'])
  return _.merge({}, props, cleanedPropsRoute)
}

const ContactsWrapper      = (props) => { return ( <ContactsWithRouter {...mergePropsRouteInProps(props)} /> ) }
const OrganizationsWrapper = (props) => { return ( <OrganizationsWithRouter {...mergePropsRouteInProps(props)} /> ) }
const ProjectsWrapper      = (props) => { return ( <ProjectsWithRouter {...mergePropsRouteInProps(props)} /> ) }
const EventsWrapper        = (props) => { return ( <EventsWithRouter {...mergePropsRouteInProps(props)} /> ) }

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.labPath
    })

    global.browserHistory = this.browserHistory;
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/contacts" component={ContactsWrapper}
                                permissions={this.props.permissions}
                                contactsPath={this.props.contactsPath}
                                organizationOptionsPath={this.props.organizationOptionsPath}
                                projectOptionsPath={this.props.projectOptionsPath}
                                eventOptionsPath={this.props.eventOptionsPath}
                                tagOptionsPath={this.props.tagOptionsPath}
                                fieldOptionsPath={this.props.fieldOptionsPath}
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={ContactsWrapper}
                            permissions={this.props.permissions} />
        </Route>

        <Route path="/organizations" component={OrganizationsWrapper}
                                     permissions={this.props.permissions}
                                     organizationsPath={this.props.organizationsPath}
                                     contactOptionsPath={this.props.contactOptionsPath}
                                     loadingImagePath={this.props.loadingImagePath}
                                     organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath}>

          <Route path=":id" component={OrganizationsWrapper}
                            permissions={this.props.permissions} />
        </Route>

        <Route path="/projects" component={ProjectsWrapper}
                                permissions={this.props.permissions}
                                projectsPath={this.props.projectsPath}
                                contactOptionsPath={this.props.contactOptionsPath}
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={ProjectsWrapper}
                            permissions={this.props.permissions} />
        </Route>

        <Route path="/events" component={EventsWrapper}
                              permissions={this.props.permissions}
                              eventsPath={this.props.eventsPath}
                              contactOptionsPath={this.props.contactOptionsPath}
                              loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={EventsWrapper}
                            permissions={this.props.permissions} />
        </Route>
      </Router>
    )
  }
}

module.exports = Routes
