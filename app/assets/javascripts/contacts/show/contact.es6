import GeneralShow        from './general_show.es6'
import GeneralEdit        from './general_edit.es6'
import SocialShow         from './social_show.es6'
import SocialEdit         from './social_edit.es6'
import OrganizationsBlock from '../../shared/organizations_block.es6'
import ItemsBlock         from './items_block.es6'
import NotesBlock         from '../../shared/notes_block.es6'
import PreviousNextNav    from '../../shared/previous_next_nav.es6'

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound:        false,
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
    var notFoundCallback = () => {
      this.setState({ notFound: true })
    }

    http.get(this.contactPath(), {}, (data) => {
      this.setState({
        contact: data,
        loaded:  true
      }, callback)
    }, notFoundCallback);
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
    if(this.state.notFound) {
      return (
        <div className="alert alert-danger">
          Ce contact n'existe pas.
        </div>
      )
    }
    else {
      return (
        <div className="item-show contact">
          { this.renderLoading() }
          { this.renderPreviousNextNav() }
          { this.renderGeneral() }
          { this.renderSocial() }
          { this.renderNotes() }
          { this.renderOrganizations() }
          { this.renderProjects() }
          { this.renderEvents() }
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
    if(this.props.loaded && !this.state.generalEditMode && !this.state.socialEditMode) {
      return (
        <PreviousNextNav items={this.props.contacts}
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
          <GeneralEdit contact={this.state.contact}
                       search={this.props.search}
                       contactPath={this.contactPath()}
                       fieldOptionsPath={this.props.fieldOptionsPath}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend}  />
        );
      }
      else {
        return (
          <GeneralShow contact={this.state.contact}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       contactPath={this.contactPath()}
                       router={this.props.router}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
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
                      reloadFromBackend={this.reloadFromBackend.bind(this)}
                      reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
        )
      }
      else {
        return (
          <SocialShow contact={this.state.contact}
                      toggleEditMode={this.toggleSocialEditMode.bind(this)}
                      permissions={this.props.permissions} />
        )
      }
    }
  }

  renderOrganizations() {
    if(this.state.loaded) {
      return (
        <OrganizationsBlock parent={this.state.contact}
                            parentType="contact"
                            parentPath={this.contactPath()}
                            optionsPath={this.props.organizationOptionsPath}
                            reloadFromBackend={this.reloadFromBackend.bind(this)}
                            reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                            canWrite={this.props.permissions.canWriteContacts} />
      );
    }
  }

  renderProjects() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Projets"
                    fieldName="projectIds"
                    items={this.state.contact.projects}
                    contact={this.state.contact}
                    contactPath={this.contactPath()}
                    removeConfirmMessage="Délier ce projet du contact ?"
                    emptyMessage="Aucun projet."
                    optionsPath={this.props.projectOptionsPath}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                    canWrite={this.props.permissions.canWriteContacts} />
      );
    }
  }

  renderEvents() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Évènements"
                    fieldName="eventIds"
                    items={this.state.contact.events}
                    contact={this.state.contact}
                    contactPath={this.contactPath()}
                    removeConfirmMessage="Délier cet évènement du contact ?"
                    emptyMessage="Aucun évènement."
                    optionsPath={this.props.projectOptionsPath}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                    canWrite={this.props.permissions.canWriteContacts}  />
      );
    }
  }

  renderNotes() {
    return (
      <NotesBlock notable={this.state.contact}
                  reloadFromBackend={this.reloadFromBackend.bind(this)} />
    )
  }
}

module.exports = Contact
