import GeneralShow     from './general_show.es6'
import GeneralEdit     from './general_edit.es6'
import ContactsBlock   from '../../shared/contacts_block.es6'
import PreviousNextNav from '../../shared/previous_next_nav.es6'

class Organization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound:        false,
      organization:    {},
      loaded:          false,
      generalEditMode: false
    };
  }

  componentDidMount() {
    this.reloadFromBackend()
  }

  componentDidUpdate(prevProps, prevState) {
     if(prevProps.id != this.props.id) {
       this.reloadFromBackend()
     }
   }

  organizationPath() {
    return this.props.organizationsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    var notFoundCallback = () => {
      this.setState({ notFound: true })
    }

    http.get(this.organizationPath(), {}, (data) => {
      this.setState({
        organization: data,
        loaded:  true
      }, callback)
    }, notFoundCallback);
  }

  toggleGeneralEditMode() {
    this.setState({
      generalEditMode: !this.state.generalEditMode
    })
  }

  render() {
    if(this.state.notFound) {
      return (
        <div className="alert alert-danger">
          Cette organisation n'existe pas/plus.
        </div>
      )
    }
    else {
      return (
        <div className="organization">
          {this.renderLoading()}
          {this.renderPreviousNextNav()}
          {this.renderGeneral()}
          {this.renderContacts()}
        </div>
      )
    }
  }

  renderLoading() {
    if(!this.state.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
  }

  renderPreviousNextNav() {
    if(this.props.loaded) {
      return (
        <PreviousNextNav items={this.props.organizations}
                         currentItemId={this.props.id}
                         router={this.props.router}
                         search={this.props.search} />
      )
    }
  }

  renderGeneral() {
    if(this.state.loaded) {
      if(this.state.generalEditMode) {
        return (
          <GeneralEdit organization={this.state.organization}
                       search={this.props.search}
                       organizationPath={this.organizationPath()}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
        );
      }
      else {
        return (
          <GeneralShow organization={this.state.organization}
                       search={this.props.search}
                       organizationPath={this.organizationPath()}
                       router={this.props.router}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
        )
      }
    }
  }

  renderContacts() {
    if(this.state.loaded) {
      return (
        <ContactsBlock parent={this.state.organization}
                       parentType="organization"
                       parentPath={this.organizationPath()}
                       optionsPath={this.props.contactOptionsPath}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
      );
    }
  }

}

module.exports = Organization
