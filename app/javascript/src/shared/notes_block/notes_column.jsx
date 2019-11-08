import Note    from './note.jsx'
import NewNote from './new_note.jsx'

export default class NotesColumn extends React.Component {

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
        <Note key={note.id}
              note={note}
              canWrite={this.props.canWrite} />
      )
    })
  }

  renderNewNote() {
    if(this.props.canWrite) {
      return (
        <NewNote notable={this.props.notable}
                 privacy={this.props.privacy} />
      )
    }
  }

}
