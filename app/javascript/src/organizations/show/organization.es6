import GeneralShow       from './general_show.es6'
import GeneralEdit       from './general_edit.es6'
import ContactsBlock     from '../../shared/contacts_block.es6'
import ItemsBlock        from '../../shared/items_block.es6'
import CustomFieldsBlock from '../../shared/custom_fields_block.es6'
import NotesBlock        from '../../shared/notes_block.es6'
import PreviousNextNav   from '../../shared/previous_next_nav.es6'
import LogEntries        from '../../shared/log_entries.es6'

class Organization extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notFound:        false,
      organization:    this.props.organization,              // When coming from index and not direct link
      loaded:          this.props.organization != undefined, //
      generalEditMode: false
    }
  }

  componentDidMount() {
    if(this.state.organization == undefined) {
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
      if(this.state.organization == undefined) {
        this.reloadFromBackend()
      }
      else {
        window.scrollTo(0, 0)
        this.setState({
          organization: this.props.organization,
          loaded:       this.props.organization != undefined
        })
      }
    }
  }

  bindCable() {
    this.cableSubscription =  App.cable.subscriptions.create({ channel: "OrganizationsChannel", lab_id: this.props.labId }, {
      received: (data) => {
        var camelData = humps.camelizeKeys(data)
        var itemId    = camelData.action == 'destroy' ? camelData.itemId : camelData.item.id

        if(itemId == this.props.id) {
          if(camelData.action == 'update') {
            this.setState({ organization: camelData.item })
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

  organizationPath() {
    return this.props.organizationsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    var notFoundCallback = () => {
      this.setState({
        loaded:   true,
        notFound: true
      })
    }

    http.get(this.organizationPath(), {}, (data) => {
      this.setState({
        organization: data,
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
            Cette organisation n'existe pas ou n'existe plus.
          </div>

          <div className="item-show organization">
            { this.renderLogEntries() }
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="item-show organization">
          { this.renderLoading() }
          { this.renderPreviousNextNav() }
          { this.renderGeneral() }
          { this.renderCustomFields() }
          { this.renderContacts() }
          { this.renderProjects() }
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
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
        )
      }
      else {
        return (
          <GeneralShow organization={this.state.organization}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       organizationPath={this.organizationPath()}
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
        <CustomFieldsBlock item={this.state.organization}
                           itemType="organization"
                           canWrite={this.props.permissions.canWriteOrganizations} />
      )
    }
  }

  renderContacts() {
    if(this.state.loaded) {
      return (
        <ContactsBlock parent={this.state.organization}
                       parentType="organization"
                       parentPath={this.organizationPath()}
                       linkName="contactOrganizationLink"
                       optionsPath={this.props.contactOptionsPath}
                       canWrite={this.props.permissions.canWriteOrganizations} />
      )
    }
  }

  renderProjects() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Projets"
                    fieldName="projectIds"
                    itemLinks={this.state.organization.projectLinks}
                    itemType="project"
                    parent={this.state.organization}
                    parentPath={this.organizationPath()}
                    backendParentParam="organization"
                    removeConfirmMessage="Délier ce projet de l'organisation ?"
                    emptyMessage="Aucun projet."
                    optionsPath={this.props.projectOptionsPath}
                    canWrite={this.props.permissions.canWriteOrganizations}
                    linkName="organizationProjectLink"  />
      )
    }
  }

  renderEvents() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Évènements"
                    fieldName="eventIds"
                    itemLinks={this.state.organization.eventLinks}
                    itemType="event"
                    parent={this.state.organization}
                    parentPath={this.organizationPath()}
                    backendParentParam="organization"
                    removeConfirmMessage="Délier cet évènement de l'organisation ?"
                    emptyMessage="Aucun évènement."
                    optionsPath={this.props.eventOptionsPath}
                    canWrite={this.props.permissions.canWriteOrganizations}
                    linkName="eventOrganizationLink"  />
      )
    }
  }

  renderNotes() {
    if(this.state.loaded) {
      return (
        <NotesBlock notable={this.state.organization}
                    canWrite={this.props.permissions.canWriteOrganizations}
                    currentUserId={this.props.currentUserId}
                    columns={2} />
      )
    }
  }

  renderLogEntries() {
    if(this.state.loaded) {
      // take current organization or forge one if doesn't exist anymore
      var organization = this.state.organization || {
        wasDeleted: true,
        id:         this.props.id,
        path:       this.organizationPath(),
        updatedAt:  null
      }

      return (
        <LogEntries item={organization}
                    loadingImagePath={this.props.loadingImagePath} />
      )
    }
  }
}

module.exports = Organization
