import { createHistory }                from 'history'
import { useRouterHistory, withRouter } from 'react-router'

import Main from './main.js.jsx'

var MainWithRouter = withRouter(Main)

// We want to access props in this.props and not in this.props.route (but it's just a personal choice)
var mergePropsRouteInProps = (props) => {
  var cleanedPropsRoute = _.omit(props.route, ['component', 'path']);
  return _.merge({}, props, cleanedPropsRoute);
}

const MainWrapper = (props) => {
  return ( <MainWithRouter {...mergePropsRouteInProps(props)} /> );
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
        <Route path="/" component={MainWrapper}
                        contactsPath={this.props.contactsPath}
                        organizationOptionsPath={this.props.organizationOptionsPath}
                        fieldOptionsPath={this.props.fieldOptionsPath}
                        eventOptionsPath={this.props.eventOptionsPath}
                        projectOptionsPath={this.props.projectOptionsPath}
                        loadingImagePath={this.props.loadingImagePath}>
          <Route path=":id" component={MainWrapper} />
        </Route>
      </Router>
    );
  }
}

module.exports = Routes
