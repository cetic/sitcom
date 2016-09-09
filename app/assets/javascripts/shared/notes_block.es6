import NotesColumn from './notes_block/notes_column.es6'

class NotesBlock extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    var publicNotes = _.filter(this.props.notable.notes, (note) => {
      return note.privacy == 'public'
    })

    var privateNotes = _.filter(this.props.notable.notes, (note) => {
      return note.privacy == 'private'
    })

    return (
      <div className="notes-block">
        <div className="row">
          <div className="col-md-6">
            <NotesColumn label="Notes publiques"
                         notable={this.props.notable}
                         notes={publicNotes}
                         privacy="public"
                         reloadFromBackend={this.props.reloadFromBackend} />
          </div>

          <div className="col-md-6">
            <NotesColumn label="Notes privées"
                         notable={this.props.notable}
                         notes={privateNotes}
                         privacy="private"
                         reloadFromBackend={this.props.reloadFromBackend} />
          </div>
        </div>
      </div>
    );
  }

}

module.exports = NotesBlock
