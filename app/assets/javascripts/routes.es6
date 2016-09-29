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
        <Route path="/contacts" component={ContactsWithRouter}
                                permissions={this.props.permissions}
                                currentUserId={this.props.currentUserId}
                                labId={this.props.labId}
                                contactsPath={this.props.contactsPath}
                                organizationOptionsPath={this.props.organizationOptionsPath}
                                projectOptionsPath={this.props.projectOptionsPath}
                                eventOptionsPath={this.props.eventOptionsPath}
                                tagOptionsPath={this.props.tagOptionsPath}
                                fieldOptionsPath={this.props.fieldOptionsPath}
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={ContactsWithRouter} />
        </Route>

        <Route path="/organizations" component={OrganizationsWithRouter}
                                     permissions={this.props.permissions}
                                     currentUserId={this.props.currentUserId}
                                     labId={this.props.labId}
                                     organizationsPath={this.props.organizationsPath}
                                     contactOptionsPath={this.props.contactOptionsPath}
                                     loadingImagePath={this.props.loadingImagePath}
                                     organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath}>

          <Route path=":id" component={OrganizationsWithRouter} />
        </Route>

        <Route path="/projects" component={ProjectsWithRouter}
                                permissions={this.props.permissions}
                                currentUserId={this.props.currentUserId}
                                labId={this.props.labId}
                                projectsPath={this.props.projectsPath}
                                contactOptionsPath={this.props.contactOptionsPath}
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={ProjectsWithRouter} />
        </Route>

        <Route path="/events" component={EventsWithRouter}
                              permissions={this.props.permissions}
                              currentUserId={this.props.currentUserId}
                              labId={this.props.labId}
                              eventsPath={this.props.eventsPath}
                              contactOptionsPath={this.props.contactOptionsPath}
                              loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={EventsWithRouter} />
        </Route>
      </Router>
    )
  }
}

module.exports = Routes
