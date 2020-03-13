export default class LogEntries extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      logEntries: [],
      open:       false,
      loaded:     false
    }
  }

  componentDidMount() {
    if(this.props.item.wasDeleted) {
      this.open()
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.item.id != this.props.item.id) {
      this.setState({
        logEntries: [],
        open:       false,
        loaded:     false
      })
    }
    else if(prevProps.item.updatedAt != this.props.item.updatedAt) {
      if(this.state.loaded && this.state.open) {
        this.reloadFromBackend()
      }
    }
  }

  logEntriesPath() {
    return this.props.item.path + '/log_entries.json'
  }

  reloadFromBackend(scroll = false, callback) {
    $.get(this.logEntriesPath(), {}, (data) => {
      this.setState({
        logEntries: data,
        loaded:     true
      }, () => {
        if(scroll) {
          $(window).scrollTo($('.log-entries'), 500, { offset: { top: -80 }})
        }

        if(callback) {
          callback()
        }
      })
    })
  }

  open() {
    this.setState({ open: true }, () =>
      this.reloadFromBackend(true)
    )
  }

  close() {
    this.setState({ open: false, loaded: false })
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
        <div className="center">
          <span className="display-log-entries" onClick={this.open.bind(this)}>
            Afficher l'historique
          </span>
        </div>
      )
    }
    else if(this.state.open && !this.state.loaded) {
      return (
        <div className="center">
          <img className="hidden" src={this.props.loadingImagePath}/>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <h3>Historique</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ul>
                { this.renderEntries() }
              </ul>

              { this.renderHideHistory() }
            </div>
          </div>
        </div>
      )
    }
  }

  renderHideHistory() {
    if(!this.props.item.wasDeleted) {
      return (
        <div className="center">
          <span className="display-log-entries" onClick={this.close.bind(this)}>
            Masquer l'historique
          </span>
        </div>
      )
    }
  }

  renderEntries() {
    if(this.state.logEntries.length == 0) {
      return (
        <li className="no-history">
          Pas d'historique
        </li>
      )
    }
    else {
      return _.map(this.state.logEntries, (entry) => {
        return this.renderEntry(entry)
      })
    }
  }

  renderEntry(entry) {
    return (
      <li key={entry.id}>
        <div className="action">
          <div className="text">
            <strong>{ entry.name }</strong> { entry.action } { entry.target }.
          </div>
          <div className="ago" title={ entry.on }>
            { entry.ago }
          </div>
        </div>

        <table className="table table-striped content">
          <tbody>
            { this.renderEntryChanges(entry.changes) }
          </tbody>
        </table>
        <div style={{ clear: 'both' }}></div>
      </li>
    )
  }

  renderEntryChanges(changes) {
    return _.map(Object.keys(changes), (key, i) => {
      var before = changes[key][0] instanceof Array ? changes[key][0].join(', ') : (changes[key][0] || '')
      var after  = changes[key][1] instanceof Array ? changes[key][1].join(', ') : (changes[key][1] || '')

      return (
        <tr key={i}>
          <th>
            { key }
          </th>
          <td dangerouslySetInnerHTML={{__html: diffString(before, after) }}>
          </td>
        </tr>
      )
    })
  }
}
