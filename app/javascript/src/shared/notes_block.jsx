import NotesColumn from './notes_block/notes_column.jsx'

export default class NotesBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      privateNotes: []
    }
  }

  componentDidMount() {
    this.reloadPrivateNotesFromBackend()
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.notable.updatedAt != prevProps.notable.updatedAt || this.props.notable.id != prevProps.notable.id) {
      this.reloadPrivateNotesFromBackend()
    }
  }

  reloadPrivateNotesFromBackend() {
    http.get(`${this.props.notable.path}/notes`, { privacy: 'private' }, (data) => {
      this.setState({
        privateNotes: data
      })
    })
  }

  render() {
    let columnSize  = this.props.columns == 1 ? '12' : '6'
    let columnClass = `col-md-${columnSize}`

    return (
      <div className="notes-block">
        <div className="row">
          <div className={columnClass}>
            {this.renderPublicColumn()}
          </div>

          <div className={columnClass}>
            {this.renderPrivateColumn()}
          </div>
        </div>
      </div>
    )
  }

  renderPublicColumn() {
    return (
      <NotesColumn label="Notes publiques"
                   notable={this.props.notable}
                   notes={this.props.notable.notes}
                   privacy="public"
                   canWrite={this.props.canWrite} />
    )
  }

  renderPrivateColumn() {
    return (
      <NotesColumn label="Notes privées"
                   notable={this.props.notable}
                   notes={this.state.privateNotes}
                   privacy="private"
                   canWrite={true} />
    )
  }

}
