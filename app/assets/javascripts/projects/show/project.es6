import GeneralShow   from './general_show.es6'
import GeneralEdit   from './general_edit.es6'
import ContactsBlock from '../../shared/contacts_block.es6'

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    $.get(this.projectPath(), (data) => {
      var camelData = humps.camelizeKeys(data)

      this.setState({
        project: camelData,
        loaded:  true
      }, callback)
    });
  }

  toggleGeneralEditMode() {
    this.setState({
      generalEditMode: !this.state.generalEditMode
    })
  }

  render() {
    return (
      <div className="project">
        {this.renderLoading()}
        {this.renderGeneral()}
        {this.renderContacts()}
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

  renderGeneral() {
    if(this.state.loaded) {
      if(this.state.generalEditMode) {
        return (
          <GeneralEdit project={this.state.project}
                       search={this.props.search}
                       projectPath={this.projectPath()}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
        );
      }
      else {
        return (
          <GeneralShow project={this.state.project}
                       search={this.props.search}
                       projectPath={this.projectPath()}
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
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
      );
    }
  }

}

module.exports = Project
