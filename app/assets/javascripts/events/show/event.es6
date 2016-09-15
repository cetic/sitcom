import GeneralShow     from './general_show.es6'
import GeneralEdit     from './general_edit.es6'
import ContactsBlock   from '../../shared/contacts_block.es6'
import NotesBlock      from '../../shared/notes_block.es6'
import PreviousNextNav from '../../shared/previous_next_nav.es6'

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound:        false,
      event:           {},
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
    var notFoundCallback = () => {
      this.setState({ notFound: true })
    }

    http.get(this.eventPath(), {}, (data) => {
      this.setState({
        event:   data,
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
          Cet évènement n'existe pas.
        </div>
      )
    }
    else {
      return (
        <div className="item-show event">
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
        <PreviousNextNav items={this.props.events}
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
          <GeneralEdit event={this.state.event}
                       search={this.props.search}
                       eventPath={this.eventPath()}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
        );
      }
      else {
        return (
          <GeneralShow event={this.state.event}
                       permissions={this.props.permissions}
                       search={this.props.search}
                       eventPath={this.eventPath()}
                       router={this.props.router}
                       toggleEditMode={this.toggleGeneralEditMode.bind(this)}
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend} />
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
                       reloadFromBackend={this.reloadFromBackend.bind(this)}
                       reloadIndexFromBackend={this.props.reloadIndexFromBackend}
                       canWrite={this.props.permissions.canWriteEvents} />
      );
    }
  }

  renderNotes() {
    if(this.state.loaded) {
      return (
        <NotesBlock notable={this.state.event}
                    reloadFromBackend={this.reloadFromBackend.bind(this)}
                    canWrite={this.props.permissions.canWriteEvents} />
      )
    }
  }
}

module.exports = Event
