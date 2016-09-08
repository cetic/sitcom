import NotesColumn from './notes_block/notes_column.es6'

class NotesBlock extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    var publicNotes = _.filter(this.props.notes, (note) => {
      return note.privacy == 'public'
    })

    var privateNotes = _.filter(this.props.notes, (note) => {
      return note.privacy == 'private'
    })

    return (
      <div className="notes-block">
        <div className="row">
          <div className="col-md-6">
            <NotesColumn label="Notes publiques" notes={publicNotes}  privacy="public" />
          </div>

          <div className="col-md-6">
            <NotesColumn label="Notes privées"   notes={privateNotes} privacy="private" />
          </div>
        </div>
      </div>
    );
  }

}

module.exports = NotesBlock
