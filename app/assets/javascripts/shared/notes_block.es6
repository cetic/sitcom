import NotesColumn from './notes_block/notes_column.es6'

class NotesBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      privateNotes: []
    }
  }

  componentDidMount() {
    this.reloadPrivateNotesFromBackend()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.notable.updatedAt != this.props.notable.updatedAt) {
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

module.exports = NotesBlock
