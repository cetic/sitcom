import GeneralShow     from './general_show.es6'
import GeneralEdit     from './general_edit.es6'
import ContactsBlock   from '../../shared/contacts_block.es6'
import NotesBlock      from '../../shared/notes_block.es6'
import PreviousNextNav from '../../shared/previous_next_nav.es6'

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound:        false,
      project:         {},
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

  projectPath() {
    return this.props.projectsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    var notFoundCallback = () => {
      this.setState({ notFound: true })
    }

    http.get(this.projectPath(), {}, (data) => {
      this.setState({
        project: data,
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
          Ce projet n'existe pas.
        </div>
      )
    }
    else {
      return (
        <div className="item-show project">
          {this.renderLoading()}
          {this.renderPreviousNextNav()}
          {this.renderGeneral()}
          {this.renderContacts()}
          {this.renderNotes()}
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
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
        );
      }
      else {
        return (
          <GeneralShow project={this.state.project}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       projectPath={this.projectPath()}
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
        <ContactsBlock parent={this.state.project}
                       parentType="project"
                       parentPath={this.projectPath()}
                       optionsPath={this.props.contactOptionsPath}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                       canWrite={this.props.permissions.canWriteProjects} />
      );
    }
  }

  renderNotes() {
    return (
      <NotesBlock notable={this.state.project}
                  reloadFromBackend={this.reloadFromBackend.bind(this)}
                  canWrite={this.props.permissions.canWriteProjects} />
    )
  }

}

module.exports = Project
