import { createHistory }                from 'history'
import { useRouterHistory, withRouter } from 'react-router'

import Storage       from './storage.es6'

import Contacts      from './contacts/main.es6'
import Organizations from './organizations/main.es6'
import Projects      from './projects/main.es6'
import Events        from './events/main.es6'

class Dispatcher extends React.Component {
  constructor(props) {
    super(props)

    this.storage = new Storage(this.props)
  }

  render() {
    if(this.props.params.itemType == 'contacts') {
      return(
        <Contacts route={this.props.route}
                  router={this.props.router}
                  location={this.props.location}
                  params={this.props.params}
                  storage={this.storage} />
      )
    }
    else if(this.props.params.itemType == 'organizations') {
      return(
        <Organizations route={this.props.route}
                       router={this.props.router}
                       location={this.props.location}
                       params={this.props.params}
                       storage={this.storage} />
      )
    }
    else if(this.props.params.itemType == 'projects') {
      return(
        <Projects route={this.props.route}
                  router={this.props.router}
                  location={this.props.location}
                  params={this.props.params}
                  storage={this.storage} />
      )
    }
    else if(this.props.params.itemType == 'events') {
      return(
        <Events route={this.props.route}
                router={this.props.router}
                location={this.props.location}
                params={this.props.params}
                storage={this.storage} />
      )
    }
  }
}

var DispatcherWithRouter = withRouter(Dispatcher)

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.labPath
    })

    global.browserHistory = this.browserHistory
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path=":itemType" component={DispatcherWithRouter}
                                permissions={this.props.permissions}
                                currentUserId={this.props.currentUserId}
                                labId={this.props.labId}
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
                                loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={DispatcherWithRouter} />
        </Route>
      </Router>
    )
  }
}

module.exports = Routes
