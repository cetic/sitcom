import { createHistory }                from 'history'
import { useRouterHistory, withRouter } from 'react-router'

import Storage       from './storage.js'

import Dashboard     from './dashboard/main.jsx'
import Contacts      from './contacts/main.jsx'
import Organizations from './organizations/main.jsx'
import Projects      from './projects/main.jsx'
import Events        from './events/main.jsx'
import LogEntries    from './log_entries/main.jsx'

class Dispatcher extends React.Component {
  constructor(props) {
    super(props)

    this.storage = new Storage(this.props)
  }

  render() {
    if(this.props.params.itemType == 'dashboard') {
      return (
        <Dashboard
          route={this.props.route}
          router={this.props.router}
          location={this.props.location}
          params={this.props.params}
          storage={this.storage}
        />
      )
    }
    else if(this.props.params.itemType == 'contacts') {
      return(
        <Contacts
          route={this.props.route}
          router={this.props.router}
          location={this.props.location}
          params={this.props.params}
          storage={this.storage}
        />
      )
    }
    else if(this.props.params.itemType == 'organizations') {
      return(
        <Organizations
          route={this.props.route}
          router={this.props.router}
          location={this.props.location}
          params={this.props.params}
          storage={this.storage}
        />
      )
    }
    else if(this.props.params.itemType == 'projects') {
      return(
        <Projects
          route={this.props.route}
          router={this.props.router}
          location={this.props.location}
          params={this.props.params}
          storage={this.storage}
        />
      )
    }
    else if(this.props.params.itemType == 'events') {
      return(
        <Events
          route={this.props.route}
          router={this.props.router}
          location={this.props.location}
          params={this.props.params}
          storage={this.storage}
        />
      )
    }
    else if(this.props.params.itemType == 'log_entries') {
      return(
        <LogEntries
          route={this.props.route}
          router={this.props.router}
          location={this.props.location}
          params={this.props.params}
          storage={this.storage}
        />
      )
    }
  }
}

var DispatcherWithRouter = withRouter(Dispatcher)

export default class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.labPath
    })

    global.browserHistory = this.browserHistory
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route
          path=":itemType"
          component={DispatcherWithRouter}
          permissions={this.props.permissions}
          currentUserId={this.props.currentUserId}
          labId={this.props.labId}
          contactCustomFields={this.props.contactCustomFields}
          organizationCustomFields={this.props.organizationCustomFields}
          eventCustomFields={this.props.eventCustomFields}
          projectCustomFields={this.props.projectCustomFields}
          dashboardPath={this.props.dashboardPath}
          contactsPath={this.props.contactsPath}
          organizationsPath={this.props.organizationsPath}
          projectsPath={this.props.projectsPath}
          eventsPath={this.props.eventsPath}
          contactOptionsPath={this.props.contactOptionsPath}
          organizationOptionsPath={this.props.organizationOptionsPath}
          projectOptionsPath={this.props.projectOptionsPath}
          eventOptionsPath={this.props.eventOptionsPath}
          tagOptionsPath={this.props.tagOptionsPath}
          fieldOptionsPath={this.props.fieldOptionsPath}
          organizationStatusesOptionsPath={this.props.organizationStatusesOptionsPath}
          loadingImagePath={this.props.loadingImagePath}
          isMailchimpConfigured={this.props.isMailchimpConfigured}>

          <Route path=":id" component={DispatcherWithRouter} />
        </Route>
      </Router>
    )
  }
}
