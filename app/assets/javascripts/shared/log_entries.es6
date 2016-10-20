class LogEntries extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      logEntries: [],
      open:       false,
      loaded:     false
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }

  logEntriesPath() {
    return this.props.item.path + '/log_entries'
  }

  reloadFromBackend(callback) {
    http.get(this.logEntriesPath(), {}, (data) => {
      this.setState({
        logEntries: data,
        loaded:     true
      }, callback)
    })
  }

  open() {
    this.setState({ open: true }, () =>
      this.reloadFromBackend()
    )
  }

  render() {
    return(
      <div className="log-entries">
        { this.renderInside() }
      </div>
    )
  }

  renderInside() {
    if(!this.state.open) {
      return (
        <span onClick={this.open.bind(this)}>
          Afficher l'historique
        </span>
      )
    }
    else if(this.state.open && !this.state.loaded) {
      return (
        <span>
          Chargement
        </span>
      )
    }
    else {
      return (
        <ul>
          { this.renderEntries() }
        </ul>
      )
    }
  }

  renderEntries() {
    return _.map(this.state.logEntries, (entry) => {
      return this.renderEntry(entry)
    })
  }

  renderEntry(entry) {
    return (
      <li key={entry.id}>
        { entry.text }

        <table className="table">
          <tbody>
            { this.renderEntryChanges(entry.changes) }
          </tbody>
        </table>
      </li>
    )
  }

  renderEntryChanges(changes) {
    return _.map(Object.keys(changes), (key, i) => {
      return (
        <tr key={i}>
          <th>
            { key }
          </th>
          <td>
            { changes[key][0] }
          </td>
          <td>
            { changes[key][1] }
          </td>
        </tr>
      )
    })
  }
}

module.exports = LogEntries
