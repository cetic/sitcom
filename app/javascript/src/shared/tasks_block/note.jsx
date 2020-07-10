export default class Note extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      noteName: '',
      noteText: ''
    }
  }

  updateNoteName(e) {
    this.setState({
      noteName: e.target.value
    })
  }

  updateNoteText(e) {
    this.setState({
      noteText: e.target.value
    })
  }

  remove() {
    if(confirm("Supprimer définitivement cette note ?")) {
      http.delete(`${this.props.note.path}`)
    }
  }

  edit() {
    this.setState({
      editMode: true,
      noteName: this.props.note.name,
      noteText: this.props.note.text
    }, () => {
      $(this.refs.noteName).focus()
    })
  }

  save() {
    var params = {
      note: {
        name: this.state.noteName,
        text: this.state.noteText
      }
    }

    http.put(`${this.props.note.path}`, params, (data) => {
      if(data.success) {
        this.cancel()
      }
    })
  }

  cancel() {
    this.setState({
      editMode: false
    })
  }

  render() {
    return (
      <div className="note">
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if(this.state.editMode) {
      return (
        <div>
          <input className="form-control"
                 type="text"
                 ref="noteName"
                 placeholder="Titre de la note"
                 value={this.state.noteName}
                 onChange={this.updateNoteName.bind(this)} />

          <textarea className="form-control"
                    ref="noteText"
                    value={this.state.noteText}
                    placeholder="Contenu"
                    onChange={this.updateNoteText.bind(this)} />

          <div className="actions">
            <button onClick={this.cancel.bind(this)}
                    className="btn btn-default">
              Annuler
            </button>

            <button onClick={this.save.bind(this)}
                    className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="note-name">
            { this.props.note.name }
          </div>

          <div className="note-text"
               dangerouslySetInnerHTML={ {__html: this.props.note.formattedText } }>
          </div>

          { this.renderButtons() }
        </div>
      )
    }
  }

  renderButtons() {
    if(this.props.canWrite) {
      return (
        <div className="buttons">
          <button className="btn btn-primary btn-xs"
                  key="edit"
                  onClick={this.edit.bind(this)}>
            <i className="fa fa-edit"></i>
          </button>

          <button className="btn btn-danger btn-xs"
                  key="delete"
                  onClick={this.remove.bind(this)}>
            <i className="fa fa-times"></i>
          </button>
        </div>
      )
    }
  }

}
