class NewNote extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      newNoteText: ''
    };
  }

  open() {
    this.setState({
      open: true
    })
  }

  cancel() {
    this.setState({
      open: false,
      newNoteText: ''
    })
  }

  save() {
    var params = {
      note: {
        text:    this.state.newNoteText,
        privacy: this.props.privacy
      }
    }

    http.post(`${this.props.notable.path}/notes`, params, (data) => {
      if(data.success) {
        this.props.reloadFromBackend()
        this.cancel()
      }
    })
  }

  updateNewNoteText(e) {
    this.setState({
      newNoteText: e.target.value
    })
  }

  render() {
    return (
      <div className="new-note">
        {this.renderOpenLink()}
        {this.renderForm()}
      </div>
    )
  }

  renderOpenLink() {
    if(!this.state.open) {
      return (
        <a href="javascript:;" onClick={this.open.bind(this)}>Nouvelle note</a>
      )
    }
  }

  renderForm() {
    if(this.state.open) {
      return (
        <form>
          <textarea value={this.state.newNoteText}
                    onChange={this.updateNewNoteText.bind(this)} />

          <a href="javascript:;"
             onClick={this.cancel.bind(this)}>Annuler</a>

          <a href="javascript:;"
             onClick={this.save.bind(this)}
             className="btn btn-primary">Ajouter</a>
        </form>
      )
    }
  }

}

module.exports = NewNote
