export default class LogEntries extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      logEntries: [],
      loaded:     false
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    $.get(`${window.location.href}.json`, (data) => {
      this.setState({
        logEntries: humps.camelizeKeys(data)
      })
    })
  }

  render() {
    return (
      <div className="container">
        <div className="log-entries" style={{ marginTop: '24px' }}>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h3>Historique des modifications</h3>

              <div className="items">
                <ul>
                  {this.renderEntries()}
                </ul>
              </div>
            </div>
          </div>
         </div>
      </div>
    )
  }

  renderEntries() {
    return _.map(this.state.logEntries, (entry) => {
      return this.renderEntry(entry)
    })
  }

  renderEntry(entry) {
    return (
      <li key={entry.id} data-entry-id={entry.id}>
        <div className="action">
          <div className="text">
            <strong>{ entry.name }</strong> { entry.action } { entry.target } <strong>{ entry.itemName }</strong>.
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
      if(changes[key]) {
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
      }
    })
  }

}
