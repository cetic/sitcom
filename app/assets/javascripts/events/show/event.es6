import GeneralShow   from './general_show.es6'
import GeneralEdit   from './general_edit.es6'
import ContactsBlock from '../../shared/contacts_block.es6'

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event:         {},
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

  eventPath() {
    return this.props.eventsPath + '/' + this.props.id
  }

  reloadFromBackend(callback) {
    $.get(this.eventPath(), (data) => {
      var camelData = humps.camelizeKeys(data)

      this.setState({
        event: camelData,
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
      <div className="event">
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
          <GeneralEdit event={this.state.event}
                       eventPath={this.eventPath()}
                       search={this.props.search}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
        );
      }
      else {
        return (
          <GeneralShow event={this.state.event}
                       search={this.props.search}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)} />
        )
      }
    }
  }

  renderContacts() {
    if(this.state.loaded) {
      return (
        <ContactsBlock parent={this.state.event}
                       parentType="event"
                       parentPath={this.eventPath()}
                       optionsPath={this.props.contactOptionsPath}
                       reloadFromBackend={this.reloadFromBackend.bind(this)} />
      );
    }
  }

}

module.exports = Event
