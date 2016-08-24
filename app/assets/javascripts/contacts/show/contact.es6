import GeneralShow from './general_show.es6'
import GeneralEdit from './general_edit.es6'
import ItemsBlock  from './items_block.es6'

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contact:  {},
      loaded:   false,
      editMode: false
    };
  }

  componentDidMount() {
    this.reloadFromBackend()
  }

  contactPath() {
    return this.props.contactsPath + '/' + this.props.id
  }

  reloadFromBackend() {
    $.get(this.contactPath(), (data) => {
      var camelData = humps.camelizeKeys(data)

      this.setState({
        contact: camelData,
        loaded:  true
      })
    });
  }

  toggleEditMode() {
    this.setState({
      editMode: !this. state.editMode
    })
  }

  render() {
    return (
      <div className="contact">
        {this.renderLoading()}
        {this.renderGeneral()}
        {this.renderProjectsBlock()}
        {this.renderEventsBlock()}
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
      if(this.state.editMode) {
        return (
          <GeneralEdit contact={this.state.contact}
                       search={this.props.search}
                       toggleEditMode={this.toggleEditMode.bind(this)} />
        );
      }
      else {
        return (
          <GeneralShow contact={this.state.contact}
                       search={this.props.search}
                       toggleEditMode={this.toggleEditMode.bind(this)} />
        )
      }
    }
  }

  renderProjectsBlock() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Projets"
                    fieldName="projectIds"
                    items={this.state.contact.projects}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    contact={this.state.contact}
                    contactPath={this.contactPath()}
                    removeConfirmMessage="Délier ce projet du contact ?" />
      );
    }
  }

  renderEventsBlock() {
    if(this.state.loaded) {
      return (
        <ItemsBlock label="Evènements"
                    fieldName="eventIds"
                    items={this.state.contact.events}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    contact={this.state.contact}
                    contactPath={this.contactPath()}
                    removeConfirmMessage="Délier cet évènement du contact ?" />
      );
    }
  }
}

module.exports = Contact
