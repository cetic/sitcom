import GeneralShow     from './general_show.es6'
import GeneralEdit     from './general_edit.es6'
import SocialShow      from './social_show.es6'
import SocialEdit      from './social_edit.es6'
import ItemsBlock      from './items_block.es6'
import PreviousNextNav from '../../shared/previous_next_nav.es6'

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contact:         {},
      loaded:          false,
      generalEditMode: false,
      socialEditMode:  false
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

  contactPath() {
    return this.props.contactsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    http.get(this.contactPath(), {}, (data) => {
      this.setState({
        contact: data,
        loaded:  true
      }, callback)
    });
  }

  toggleGeneralEditMode() {
    this.setState({
      generalEditMode: !this.state.generalEditMode
    })
  }

  toggleSocialEditMode() {
    this.setState({
      socialEditMode: !this.state.socialEditMode
    })
  }


  render() {
    return (
      <div className="contact">
        {this.renderLoading()}
        {this.renderPreviousNextNav()}
        {this.renderGeneral()}
        {this.renderSocial()}
        {this.renderProjects()}
        {this.renderEvents()}
      </div>
    )
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
    return (
      <PreviousNextNav gotoPrevious={this.props.gotoPrevious}
                       gotoNext={this.props.gotoNext}
                       hasPrevious={this.props.hasPrevious} />
    )
  }

  renderGeneral() {
    if(this.state.loaded) {
      if(this.state.generalEditMode) {
        return (
          <GeneralEdit contact={this.state.contact}
                       search={this.props.search}
                       contactPath={this.contactPath()}
                       organizationOptionsPath={this.props.organizationOptionsPath}
                       fieldOptionsPath={this.props.fieldOptionsPath}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
        );
      }
      else {
        return (
          <GeneralShow contact={this.state.contact}
                       search={this.props.search}
                       contactPath={this.contactPath()}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
        )
      }
    }
  }

  renderSocial() {
    if(this.state.loaded) {
      if(this.state.socialEditMode) {
        return (
          <SocialEdit contact={this.state.contact}
                      contactPath={this.contactPath()}
                      toggleEditMode={this.toggleSocialEditMode.bind(this)}
                      reloadFromBackend={this.reloadFromBackend.bind(this)} />
        )
      }
      else {
        return (
          <SocialShow contact={this.state.contact}
                      toggleEditMode={this.toggleSocialEditMode.bind(this)} />
        )
      }
    }
  }

  renderProjects() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Projets"
                    fieldName="projectIds"
                    items={this.state.contact.projects}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    contact={this.state.contact}
                    contactPath={this.contactPath()}
                    removeConfirmMessage="Délier ce projet du contact ?"
                    emptyMessage="Aucun projet."
                    optionsPath={this.props.projectOptionsPath} />
      );
    }
  }

  renderEvents() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Evènements"
                    fieldName="eventIds"
                    items={this.state.contact.events}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    contact={this.state.contact}
                    contactPath={this.contactPath()}
                    removeConfirmMessage="Délier cet évènement du contact ?"
                    emptyMessage="Aucun évènement."
                    optionsPath={this.props.projectOptionsPath} />
      );
    }
  }
}

module.exports = Contact
