import GeneralShow        from './general_show.jsx'
import GeneralEdit        from './general_edit.jsx'
import ContactsBlock      from '../../shared/contacts_block.jsx'
import OrganizationsBlock from '../../shared/organizations_block.jsx'
import ItemsBlock         from '../../shared/items_block.jsx'
import CustomFieldsBlock  from '../../shared/custom_fields_block.jsx'
import NotesBlock         from '../../shared/notes_block.jsx'
import TasksBlock         from '../../shared/tasks_block.jsx'
import PreviousNextNav    from '../../shared/previous_next_nav.jsx'
import FollowButton       from '../../shared/follow_button.jsx'
import LogEntries         from '../../shared/log_entries.jsx'

export default class Event extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notFound:        false,
      event:           this.props.event,              // When coming from index and not direct link
      loaded:          this.props.event != undefined, //
      generalEditMode: false
    }
  }

  componentDidMount() {
    if(this.state.event == undefined) {
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
      if(this.state.event == undefined || this.state.event.id != this.props.id) {
        this.reloadFromBackend()
      }
      else {
        window.scrollTo(0, 0)

        this.setState({
          event:  this.props.event,
          loaded: this.props.event != undefined
        })
      }
    }
  }

  bindCable() {
    this.cableSubscription = App.cable.subscriptions.create({ channel: "EventsChannel", lab_id: this.props.labId }, {
      received: (data) => {
        var camelData = humps.camelizeKeys(data)
        var itemId    = camelData.action == 'destroy' ? camelData.itemId : camelData.item.id

        if(itemId == this.props.id) {
          if(camelData.action == 'update' || camelData.action == 'create') {
            this.setState({ event: camelData.item })
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

  eventPath() {
    return this.props.eventsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    var notFoundCallback = () => {
      this.setState({
        loaded:   true,
        notFound: true
      })
    }

    http.get(this.eventPath() + '.json', {}, (data) => {
      this.setState({
        event:   data,
        loaded:  true
      }, callback)
    }, notFoundCallback)
  }

  toggleGeneralEditMode() {
    this.setState({
      generalEditMode: !this.state.generalEditMode
    })
  }

  render() {
    if(this.state.notFound) {
      return (
        <div>
          <div className="alert alert-danger">
            Cet événement n'existe pas ou n'existe plus.
          </div>

          <div className="item-show event">
            { this.renderLogEntries() }
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="item-show event">
          { this.renderLoading() }
          { this.renderPreviousNextNav() }
          { this.renderFollowButton() }
          { this.renderGeneral() }
          { this.renderCustomFields() }
          { this.renderContacts() }
          { this.renderOrganizations() }
          { this.renderProjects() }
          { this.renderTasks() }
          { this.renderNotes() }
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
    if(this.props.loaded && !this.state.generalEditMode) {
      return (
        <PreviousNextNav items={this.props.events}
                         currentItemId={this.props.id}
                         router={this.props.router}
                         search={this.props.search} />
      )
    }
  }

  renderFollowButton() {
    if(this.props.loaded && !this.state.generalEditMode) {
      return (
        <FollowButton itemId={this.props.id}
                      itemPath={this.eventPath()}
                      itemType="event" />
      )
    }
  }

  renderGeneral() {
    if(this.state.loaded) {
      if(this.state.generalEditMode) {
        return (
          <GeneralEdit event={this.state.event}
                       search={this.props.search}
                       eventPath={this.eventPath()}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
        )
      }
      else {
        return (
          <GeneralShow event={this.state.event}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       eventPath={this.eventPath()}
                       tagOptionsPath={this.props.tagOptionsPath}
                       router={this.props.router}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
        )
      }
    }
  }

  renderCustomFields() {
    if(this.state.loaded) {
      return (
        <CustomFieldsBlock item={this.state.event}
                           itemType="event"
                           canWrite={this.props.permissions.canWriteEvents} />
      )
    }
  }

  renderContacts() {
    if(this.state.loaded) {
      return (
        <ContactsBlock parent={this.state.event}
                       parentType="event"
                       parentPath={this.eventPath()}
                       linkName="contactEventLink"
                       optionsPath={this.props.contactOptionsPath}
                       canWrite={this.props.permissions.canWriteEvents} />
      )
    }
  }

  renderOrganizations() {
    if(this.state.loaded) {
      return (
        <OrganizationsBlock parent={this.state.event}
                            parentType="event"
                            parentPath={this.eventPath()}
                            linkName="eventOrganizationLink"
                            optionsPath={this.props.organizationOptionsPath}
                            canWrite={this.props.permissions.canWriteEvents} />
      )
    }
  }

  renderProjects() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Projets"
                    fieldName="projectIds"
                    itemLinks={this.state.event.projectLinks}
                    itemType="project"
                    parent={this.state.event}
                    parentPath={this.eventPath()}
                    backendParentParam="event"
                    removeConfirmMessage="Délier ce projet de l'événement ?"
                    emptyMessage="Aucun projet."
                    optionsPath={this.props.projectOptionsPath}
                    canWrite={this.props.permissions.canWriteEvents}
                    linkName="eventProjectLink"  />
      )
    }
  }

  renderTasks() {
    if(this.state.loaded) {
      return (
        <TasksBlock item={this.state.event}
                    canWrite={this.props.permissions.canWriteEvents}
                    currentUserId={this.props.currentUserId}
                    columns={1} />
      )
    }
  }

  renderNotes() {
    if(this.state.loaded) {
      return (
        <NotesBlock notable={this.state.event}
                    canWrite={this.props.permissions.canWriteEvents}
                    currentUserId={this.props.currentUserId}
                    columns={2} />
      )
    }
  }

  renderLogEntries() {
    if(this.state.loaded) {
      // take current event or forge one if doesn't exist anymore
      var event = this.state.event || {
        wasDeleted: true,
        id:         this.props.id,
        path:       this.eventPath(),
        updatedAt:  null
      }

      return (
        <LogEntries item={event}
                    loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}
