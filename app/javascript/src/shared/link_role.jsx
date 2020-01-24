export default class LinkRole extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode:    false,
      role:        props.link.role,
      suggestions: []
    }
  }

  reloadSuggestions() {
    let splitted = this.props.link.path.split('/')
    splitted.pop()
    let url = splitted.join('/')

    http.get(`${url}/options.json`, {}, (data) => {
      this.setState({ suggestions: data.roles })
    })
  }

  updateRole(e) {
    this.setState({ role: e.target.value })
  }

  saveOnEnter(e) {
    if(this.props.canWrite) {
      if(e.key == 'Enter') {
        this.saveOnBackend()
      }
    }
  }

  saveOnBackend() {
    http.put(this.props.link.path, {
      [`${this.props.linkName}`]: {
        role: this.state.role
      }
    }, () => {
      this.setState({ editMode: false })
    })
  }

  setEditMode(editMode) {
    this.setState({ editMode: editMode }, () => {
      if(editMode) {
        $(this.refs.input).focus()

        this.reloadSuggestions()
      }
    })
  }

  assignSuggestion(suggestion) {
    this.setState({ role: suggestion }, () => {
      this.saveOnBackend()
    })
  }

  cancel() {
    this.setState({
      editMode: false,
      role:     this.props.link.role
    })
  }

  filteredSuggestions() {
    let filteredSuggestions =  _.filter(this.state.suggestions, (suggestion) => {
      return suggestion.toLowerCase().indexOf(this.state.role) > -1
    })

    _.pull(filteredSuggestions, this.state.role);

    return filteredSuggestions
  }

  render() {
    if(this.props.canWrite && this.state.editMode) {
      return (
        <div>
          <input type="text"
                 ref="input"
                 className="form-control"
                 name="role"
                 value={this.state.role}
                 onChange={this.updateRole.bind(this)}
                 onKeyPress={this.saveOnEnter.bind(this)} />

          { this.renderSuggestionsContainer() }

          <a href="javascript:;"
             style={{ marginLeft: '7px' }}
             onClick={this.cancel.bind(this)}>
            Annuler
          </a>
        </div>
      )
    }
    else {
      return (
        <div>
          <span>{this.state.role}</span>
          {this.renderEditLink()}
        </div>
      )
    }
  }

  renderEditLink() {
    if(this.props.canWrite) {
      const style = { marginLeft: _.trim(this.state.role).length > 0 ? '7px' : '0px' }

      return (
        <a href="javascript:;"
           style={style}
           className="edit-role"
           onClick={this.setEditMode.bind(this, true)}>Modifier le rôle</a>
      )
    }
  }

  renderSuggestionsContainer() {
    if(this.filteredSuggestions().length) {
      return (
        <div className="suggestions">
          { this.renderSuggestions() }
        </div>
      )
    }
  }

  renderSuggestions() {
    return _.map(this.filteredSuggestions(), (suggestion, index) => {
      return (
        <div className="suggestion"
             key={index}
             onClick={this.assignSuggestion.bind(this, suggestion)}>
          { suggestion }
        </div>
      )
    })
  }
}
