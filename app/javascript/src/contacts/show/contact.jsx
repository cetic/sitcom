import GeneralShow        from './general_show.jsx'
import GeneralEdit        from './general_edit.jsx'
import SocialShow         from './social_show.jsx'
import SocialEdit         from './social_edit.jsx'
import OrganizationsBlock from '../../shared/organizations_block.jsx'
import ItemsBlock         from '../../shared/items_block.jsx'
import NotesBlock         from '../../shared/notes_block.jsx'
import DocumentsBlock     from '../../shared/documents_block.jsx'
import PreviousNextNav    from '../../shared/previous_next_nav.jsx'
import CustomFieldsBlock  from '../../shared/custom_fields_block.jsx'
import LogEntries         from '../../shared/log_entries.jsx'

export default class Contact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notFound:        false,
      contact:         this.props.contact,              // When coming from index and not direct link
      loaded:          this.props.contact != undefined, //
      generalEditMode: false,
      socialEditMode:  false
    }
  }

  componentDidMount() {
    if(this.state.contact == undefined) {
      this.reloadFromBackend()
    }
    else {
      window.scrollTo(0, 0)
    }

    this.bindCable()
  }

  componentWillUnmount() {
    this.unbindCable()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.id != this.props.id) {
      if(this.state.contact == undefined || this.state.contact.id != this.props.id) {
        this.reloadFromBackend()
      }
      else {
        window.scrollTo(0, 0)

        this.setState({
          contact: this.props.contact,
          loaded:  this.props.contact != undefined
        })
      }
    }
  }

  bindCable() {
    this.cableSubscription = App.cable.subscriptions.create({ channel: "ContactsChannel", lab_id: this.props.labId }, {
      received: (data) => {
        var camelData = humps.camelizeKeys(data)
        var itemId    = camelData.action == 'destroy' ? camelData.itemId : camelData.item.id

        if(itemId == this.props.id) {
          if(camelData.action == 'update') {
            this.setState({ contact: camelData.item })
          }
          else {
            this.setState({ notFound: true })
          }
        }
      }
    })
  }

  unbindCable() {
    App.cable.subscriptions.remove(this.cableSubscription)
  }

  contactPath() {
    return this.props.contactsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    var notFoundCallback = () => {
      this.setState({
        loaded:   true,
        notFound: true
      })
    }

    http.get(this.contactPath() + '.json', {}, (data) => {
      this.setState({
        contact: data,
        loaded:  true
      }, callback)
    }, notFoundCallback)
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
        <div>
          <div className="alert alert-danger">
            Ce contact n'existe pas ou n'existe plus.
          </div>

          <div className="item-show contact">
            { this.renderLogEntries() }
          </div>
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
          { this.renderCustomFields() }
          { this.renderNotes() }
          { this.renderDocuments() }
          { this.renderOrganizations() }
          { this.renderProjects() }
          { this.renderEvents() }
          { this.renderLogEntries() }
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
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
        )
      }
      else {
        return (
          <GeneralShow contact={this.state.contact}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       contactPath={this.contactPath()}
                       tagOptionsPath={this.props.tagOptionsPath}
                       router={this.props.router}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
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
                      toggleEditMode={this.toggleSocialEditMode.bind(this)} />
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

  renderCustomFields() {
    if(this.state.loaded) {
      return (
        <CustomFieldsBlock item={this.state.contact}
                           itemType="contact"
                           canWrite={this.props.permissions.canWriteContacts} />
      )
    }
  }

  renderOrganizations() {
    if(this.state.loaded) {
      return (
        <OrganizationsBlock parent={this.state.contact}
                            parentType="contact"
                            parentPath={this.contactPath()}
                            optionsPath={this.props.organizationOptionsPath}
                            linkName="contactOrganizationLink"
                            canWrite={this.props.permissions.canWriteContacts} />
      )
    }
  }

  renderProjects() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Projets"
                    fieldName="projectIds"
                    itemLinks={this.state.contact.projectLinks}
                    itemType="project"
                    parent={this.state.contact}
                    parentPath={this.contactPath()}
                    backendParentParam="contact"
                    removeConfirmMessage="Délier ce projet du contact ?"
                    emptyMessage="Aucun projet."
                    optionsPath={this.props.projectOptionsPath}
                    canWrite={this.props.permissions.canWriteContacts}
                    linkName="contactProjectLink" />
      )
    }
  }

  renderEvents() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Évènements"
                    fieldName="eventIds"
                    itemLinks={this.state.contact.eventLinks}
                    itemType="event"
                    parent={this.state.contact}
                    parentPath={this.contactPath()}
                    backendParentParam="contact"
                    removeConfirmMessage="Délier cet évènement du contact ?"
                    emptyMessage="Aucun évènement."
                    optionsPath={this.props.eventOptionsPath}
                    canWrite={this.props.permissions.canWriteContacts}
                    linkName="contactEventLink"  />
      )
    }
  }

  renderNotes() {
    if(this.state.loaded) {
      return (
        <NotesBlock notable={this.state.contact}
                    canWrite={this.props.permissions.canWriteContacts}
                    currentUserId={this.props.currentUserId}
                    columns={1} />
      )
    }
  }

  renderDocuments() {
    if(this.state.loaded) {
      return (
        <DocumentsBlock item={this.state.contact}
                        canWrite={this.props.permissions.canWriteContacts}
                        currentUserId={this.props.currentUserId} />
      )
    }
  }

  renderLogEntries() {
    if(this.state.loaded) {
      // take current contact or forge one if doesn't exist anymore
      var contact = this.state.contact || {
        wasDeleted: true,
        id:         this.props.id,
        path:       this.contactPath(),
        updatedAt:  null
      }

      return (
        <LogEntries item={contact}
                    loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}
