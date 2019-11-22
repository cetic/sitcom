import GeneralShow        from './general_show.jsx'
import GeneralEdit        from './general_edit.jsx'
import ContactsBlock      from '../../shared/contacts_block.jsx'
import OrganizationsBlock from '../../shared/organizations_block.jsx'
import ItemsBlock         from '../../shared/items_block.jsx'
import CustomFieldsBlock  from '../../shared/custom_fields_block.jsx'
import NotesBlock         from '../../shared/notes_block.jsx'
import PreviousNextNav    from '../../shared/previous_next_nav.jsx'
import LogEntries         from '../../shared/log_entries.jsx'

export default class Project extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notFound:        false,
      project:         this.props.project,              // When coming from index and not direct link
      loaded:          this.props.project != undefined, //
      generalEditMode: false
    }
  }

  componentDidMount() {
    if(this.state.project == undefined) {
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
      if(this.state.project == undefined) {
        this.reloadFromBackend()
      }
      else {
        window.scrollTo(0, 0)
        this.setState({
          project: this.props.project,
          loaded:  this.props.project != undefined
        })
      }
    }
  }

  bindCable() {
    this.cableSubscription = App.cable.subscriptions.create({ channel: "ProjectsChannel", lab_id: this.props.labId }, {
      received: (data) => {
        var camelData = humps.camelizeKeys(data)
        var itemId    = camelData.action == 'destroy' ? camelData.itemId : camelData.item.id

        if(itemId == this.props.id) {
          if(camelData.action == 'update') {
            this.setState({ project: camelData.item })
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

  projectPath() {
    return this.props.projectsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    var notFoundCallback = () => {
      this.setState({
        loaded:   true,
        notFound: true
      })
    }

    http.get(this.projectPath() + '.json', {}, (data) => {
      this.setState({
        project: data,
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
            Ce projet n'existe pas ou n'existe plus.
          </div>

          <div className="item-show project">
            { this.renderLogEntries() }
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="item-show project">
          { this.renderLoading() }
          { this.renderPreviousNextNav() }
          { this.renderGeneral() }
          { this.renderCustomFields() }
          { this.renderContacts() }
          { this.renderOrganizations() }
          { this.renderEvents() }
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
        <PreviousNextNav items={this.props.projects}
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
          <GeneralEdit project={this.state.project}
                       search={this.props.search}
                       projectPath={this.projectPath()}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
        )
      }
      else {
        return (
          <GeneralShow project={this.state.project}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       projectPath={this.projectPath()}
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
        <CustomFieldsBlock item={this.state.project}
                           itemType="project"
                           canWrite={this.props.permissions.canWriteProjects} />
      )
    }
  }

  renderContacts() {
    if(this.state.loaded) {
      return (
        <ContactsBlock parent={this.state.project}
                       parentType="project"
                       parentPath={this.projectPath()}
                       linkName="contactProjectLink"
                       optionsPath={this.props.contactOptionsPath}
                       canWrite={this.props.permissions.canWriteProjects} />
      )
    }
  }

  renderOrganizations() {
    if(this.state.loaded) {
      return (
        <OrganizationsBlock parent={this.state.project}
                            parentType="project"
                            parentPath={this.projectPath()}
                            linkName="organizationProjectLink"
                            optionsPath={this.props.organizationOptionsPath}
                            canWrite={this.props.permissions.canWriteProjects} />
      )
    }
  }

  renderEvents() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Évènements"
                    fieldName="eventIds"
                    itemLinks={this.state.project.eventLinks}
                    itemType="event"
                    parent={this.state.project}
                    parentPath={this.projectPath()}
                    backendParentParam="project"
                    removeConfirmMessage="Délier cet évènement du projet ?"
                    emptyMessage="Aucun évènement."
                    optionsPath={this.props.eventOptionsPath}
                    canWrite={this.props.permissions.canWriteProjects}
                    linkName="eventProjectLink"  />
      )
    }
  }
  renderNotes() {
    if(this.state.loaded) {
      return (
        <NotesBlock notable={this.state.project}
                    canWrite={this.props.permissions.canWriteProjects}
                    currentUserId={this.props.currentUserId}
                    columns={2} />
      )
    }
  }

  renderLogEntries() {
    if(this.state.loaded) {
      // take current project or forge one if doesn't exist anymore
      var project = this.state.project || {
        wasDeleted: true,
        id:         this.props.id,
        path:       this.projectPath(),
        updatedAt:  null
      }

      return (
        <LogEntries item={project}
                    loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}
