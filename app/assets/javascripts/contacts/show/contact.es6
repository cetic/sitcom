import GeneralShow from './general_show.es6'
import GeneralEdit from './general_edit.es6'

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
        { this.renderLoading() }
        { this.renderGeneral() }
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
}

module.exports = Contact
