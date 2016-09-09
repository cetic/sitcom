class Note extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    };
  }

  updateNoteText(e) {
    this.setState({
      noteText: e.target.value
    })
  }

  remove() {
    this.props.removeNote()
  }

  edit() {
    this.setState({
      editMode: true,
      noteText: this.props.note.text
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
        this.props.reloadFromBackend()
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
        <form>
          <textarea value={this.state.noteText}
                    onChange={this.updateNoteText.bind(this)} />

          <a href="javascript:;"
             onClick={this.cancel.bind(this)}>Annuler</a>

          <a href="javascript:;"
             onClick={this.save.bind(this)}
             className="btn btn-primary">Enregistrer</a>
        </form>
      )
    }
    else {
      return (
        <div>
          <div className="note-text">{this.props.note.text}</div>
          {this.renderButtons()}
        </div>
      )
    }
  }

  renderButtons() {
    return (
      <div>
        <a href="javascript:;"
           className="btn btn-xs"
           onClick={this.edit.bind(this)}>
          <i className="fa fa-edit"></i>
        </a>

        <a href="javascript:;"
           className="btn btn-xs"
           onClick={this.remove.bind(this)}>
          <i className="fa fa-times"></i>
        </a>
      </div>
    )
  }

}

module.exports = Note
