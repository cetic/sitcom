import { createHistory }                from 'history'
import { useRouterHistory, withRouter } from 'react-router'

import Main from './main.es6'

var MainWithRouter = withRouter(Main)

const MainWrapper = (props) => {
  return ( <MainWithRouter {...mergePropsRouteInProps(props)} /> );
}

class Routes extends React.Component {
  componentWillMount() {
    this.browserHistory = useRouterHistory(createHistory)({
      basename: this.props.eventsPath
    });
  }

  render() {
    return (
      <Router history={this.browserHistory}>
        <Route path="/" component={MainWrapper}
                        eventsPath={this.props.eventsPath}
                        loadingImagePath={this.props.loadingImagePath}>

          <Route path=":id" component={MainWrapper} />
        </Route>
      </Router>
    );
  }
}

module.exports = Routes
