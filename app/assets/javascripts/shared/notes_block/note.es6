class Note extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false
    }
  }

  updateNoteText(e) {
    this.setState({
      noteText: e.target.value
    })
  }

  remove(e) {
    if(confirm("Supprimer définitivement cette note ?")) {
      http.delete(`${this.props.note.path}`)
    }
  }

  edit() {
    this.setState({
      editMode: true,
      noteText: this.props.note.text
    }, () => {
      $(this.refs.textarea).focus()
    })
  }

  save() {
    var params = {
      note: {
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
          <textarea ref="textarea"
                    value={this.state.noteText}
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
          <div className="note-text">
            { this.props.note.text }
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

module.exports = Note
