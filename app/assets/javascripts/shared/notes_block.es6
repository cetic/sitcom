import NotesColumn from './notes_block/notes_column.es6'

class NotesBlock extends React.Component {

  render() {
    return (
      <div className="notes-block">
        <div className="row">
          <div className="col-md-6">
            {this.renderPublicColumn()}
          </div>

          <div className="col-md-6">
            {this.renderPrivateColumn()}
          </div>
        </div>
      </div>
    )
  }

  renderPublicColumn() {
    var notes = _.filter(this.props.notable.notes, (note) => {
      return note.privacy == 'public'
    })

    return (
      <NotesColumn label="Notes publiques"
                   notable={this.props.notable}
                   notes={notes}
                   privacy="public"
                   canWrite={this.props.canWrite} />
    )
  }

  renderPrivateColumn() {
    var notes = _.filter(this.props.notable.notes, (note) => {
      return note.privacy == 'private' && note.userId == this.props.currentUserId
    })

    return (
      <NotesColumn label="Notes privées"
                   notable={this.props.notable}
                   notes={notes}
                   privacy="private"
                   canWrite={true} />
    )
  }

}

module.exports = NotesBlock
