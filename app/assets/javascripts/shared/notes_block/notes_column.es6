import Note    from './note.es6'
import NewNote from './new_note.es6'

class NotesColumn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="notes-column">
        <h3>{this.props.label} ({this.props.notes.length})</h3>

        {this.renderNotes()}
        {this.renderNewNote()}
      </div>
    )
  }

  renderNotes() {
    return _.map(this.props.notes, (note) => {
      return (
        <Note key={note.id} note={note} />
      )
    })
  }

  renderNewNote() {
    return (
      <NewNote />
    )
  }

}

module.exports = NotesColumn
