import QuickSearch from '../shared/quick_search.jsx'
import _           from 'lodash'

export default class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      metrics:     undefined,
      events:      [],
      logEntries:  [],
      onlineUsers: [],
      quickSearch: ""
    }
  }

  componentDidMount() {
    this.reloadMetricsFromBackend()
    this.reloadEventsFromBackend()
    this.reloadLogEntriesFromBackend()
    this.reloadOnlineUsersFromBackend()

    // Remove selected menu
    $('.nav.sections li').removeClass('selected')
  }

  reloadMetricsFromBackend() {
    http.get(this.dashboardPath() + 'metrics.json', {}, (data) => {
      this.setState({
        metrics: data
      })
    })
  }

  reloadEventsFromBackend() {
    http.get(this.dashboardPath() + 'events.json', {}, (data) => {
      this.setState({
        events: data.events
      })
    })
  }

  reloadLogEntriesFromBackend() {
    http.get(this.dashboardPath() + 'log_entries.json', {}, (data) => {
      this.setState({
        logEntries: data
      })
    })
  }

  reloadOnlineUsersFromBackend() {
    http.get(this.dashboardPath() + 'online_users.json', {}, (data) => {
      this.setState({
        onlineUsers: data.onlineUsers
      })
    })
  }

  dashboardPath() {
    return this.props.route.dashboardPath + '/'
  }

  updateQuickSearch(event) {
    this.setState({
      quickSearch: event.target.value
    })
  }

  submitQuickSearch(event) {
    if(event.charCode === 13) {
      const value = _.trim(event.target.value)

      if(value.length > 0) {
        this.props.router.push(`/contacts?quickSearch=${value}`)
      }
    }
  }

  render() {
    return (
      <div>
        <div className={`container-fluid container-dashboard`}>
          <div className="row">
            <div className={`col-md-12 col-dashboard`}>
              { this.renderQuickSearch() }
            </div>
          </div>
        </div>
        <div className={`container-fluid container-dashboard`}>
          { this.renderMetricsTitle() }
        </div>
        <div className={`container container-dashboard`}>
          { this.renderMetrics() }
        </div>
        <div className={`container-fluid container-dashboard`}>
          { this.renderAgendaTitle() }
        </div>
        <div className={`container container-dashboard`}>
          { this.renderAgenda() }
        </div>
        <div className={`container-fluid container-dashboard`}>
          { this.renderActivityTitle() }
        </div>
        <div className={`container container-dashboard`}>
          { this.renderActivity() }
        </div>
      </div>
    )
  }

  renderQuickSearch() {
    return (
      <div className="quick-search row">
        <Link to={`/dashboard`}>
          <span className="title">
            Dashboard
          </span>
        </Link>

        <input ref="search"
               type="search"
               className="form-control"
               placeholder="Recherche rapide"
               value={this.state.quickSearch}
               onChange={this.updateQuickSearch.bind(this)}
               onKeyPress={this.submitQuickSearch.bind(this)} />

        <i className="glyphicon glyphicon-search"></i>

        <div className="buttons">
          <Link className="btn btn-primary" to={`/contacts?quickSearch=${this.state.quickSearch}`}>
            <i className="fa fa-user"></i>
          </Link>
          <Link className="btn btn-primary" to={`/organizations?quickSearch=${this.state.quickSearch}`}>
            <i className="fa fa-building-o"></i>
          </Link>
          <Link className="btn btn-primary" to={`/projects?quickSearch=${this.state.quickSearch}`}>
            <i className="fa fa-file-text-o"></i>
          </Link>
          <Link className="btn btn-primary" to={`/events?quickSearch=${this.state.quickSearch}`}>
            <i className="fa fa-calendar"></i>
          </Link>
        </div>
      </div>
    )
  }

  renderMetricsTitle() {
    return (
      <div className="row row-header row-header-metrics">
        <span className="title">
          Chiffres clés
        </span>
      </div>
    )
  }

  renderMetrics() {
    return (
      <div className="row-metrics">
        <div className="col-md-3">
          <Link to={`/contacts`}>
            <div className="card">
              <i className="fa fa-user"></i>
              <span className="number">{ this.state.metrics ? this.state.metrics.contacts : '' }</span><br/>
              Contacts au total
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to={`/organizations`}>
            <div className="card">
              <i className="fa fa-building-o"></i>
              <span className="number">{ this.state.metrics ? this.state.metrics.organizations : '' }</span><br/>
              Organisations au total
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to={`/projects`}>
            <div className="card">
              <i className="fa fa-file-text-o"></i>
              <span className="number">{ this.state.metrics ? this.state.metrics.projects : '' }</span><br/>
              Projets au total
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to={`/events`}>
            <div className="card">
              <i className="fa fa-calendar"></i>
              <span className="number">{ this.state.metrics ? this.state.metrics.events : '' }</span><br/>
              Évènements au total
            </div>
          </Link>
        </div>
      </div>
    )
  }

  renderAgendaTitle() {
    return (
      <div className="row row-header row-header-agenda">
        <span className="title">
          Agenda
        </span>
      </div>
    )
  }

  renderAgenda() {
    return (
      <div className="row-agenda">
        <div className="card">
          <div className="col-md-9">
            <h2>Évènements à venir</h2>
            <div className="events">
              { this.renderEventsBlankSlate() }
              { this.renderEvents() }
            </div>
          </div>
          <div className="col-md-3 col-button">
            <Link to={`/events`}>
              <div className="btn btn-primary btn-list">
                Liste des évènements
              </div>
            </Link>
          </div>
          <div style={{clear: 'both'}}>
          </div>
        </div>
      </div>
    )
  }

  renderEventsBlankSlate() {
    if(this.state.events.length == 0) {
      return (
        <div className="empty-slate">
          <em>Aucun évènement à venir</em>
        </div>
      )
    }
  }

  renderEvents() {
    return _.map(this.state.events, (event) => {
      return this.renderEvent(event)
    })
  }

  renderEvent(event) {
    return (
      <div className="event" key={`${event.id}`} title={event.description}>
        <div className="date">
          { event.happensOn }
        </div>
        <div className="picture">
          <img className="img-thumbnail" src={event.pictureUrl}/>
        </div>
        <div className="name">
          <Link to={`/events/${event.id}`}>
            { event.name }
          </Link>
          { this.renderContactsAndOrganizationsText(event)} — { event.place }
        </div>
        <div style={{clear: 'both'}}>
        </div>
      </div>
    )
  }

  renderContactsAndOrganizationsText(event) {
    let textArray = []

    if(event.contactsCount > 0) {
      if(event.contactsCount == 1) {
        textArray.push(`${event.contactsCount} contact`)
      }
      else {
        textArray.push(`${event.contactsCount} contacts`)
      }
    }

    if(event.organizationsCount > 0) {
      if(event.organizationsCount == 1) {
        textArray.push(`${event.organizationsCount} organisation`)
      }
      else {
        textArray.push(`${event.organizationsCount} organisations`)
      }
    }

    if(textArray.length > 0) {
      return " — " + _.join(textArray, ' et ')
    }
    else {
      return ''
    }
  }

  renderActivityTitle() {
    return (
      <div className="row row-header row-header-activity">
        <span className="title">
          Rapport d'activités
        </span>
      </div>
    )
  }

  renderActivity() {
    return (
      <div className="row-activity">
        <div className="col-md-8">
          <div className="card">
            <h2>Modifications récentes</h2>
            <div className="log-entries">
              <ul>
                { this.renderLogEntries() }
              </ul>
            </div>
            <div className="cta">
              <Link to={'/log_entries'}>
                <div className="btn btn-primary btn-see-more">
                  Voir plus de modifications
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <h2>Utilisateurs en ligne</h2>
            <div className="users">
              { this.renderActivityOnlineUsers() }
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderLogEntries() {
    return _.map(this.state.logEntries, (entry) => {
      return this.renderLogEntry(entry)
    })
  }

  renderLogEntry(entry) {
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

  renderActivityOnlineUsers() {
    return _.map(this.state.onlineUsers, (user) => {
      return (
        <div className="user" key={user.id}>
          <div className="name">
            { user.name }
          </div>
          <div className="time">
            { user.lastSeenAtAgo }
          </div>
          <div style={{ clear: 'both' }}>
          </div>
        </div>
      )
    })
  }
}
