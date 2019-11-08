export default class NewNote extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      open:        false,
      newNoteName: '',
      newNoteText: ''
    }
  }

  open() {
    this.setState({
      open: true
    })
  }

  cancel() {
    this.setState({
      open:        false,
      newNoteName: '',
      newNoteText: ''
    })
  }

  save() {
    var params = {
      note: {
        name:    this.state.newNoteName,
        text:    this.state.newNoteText,
        privacy: this.props.privacy
      }
    }

    http.post(`${this.props.notable.path}/notes`, params, (data) => {
      if(data.success) {
        this.cancel()
      }
    })
  }

  updateNewNoteName(e) {
    this.setState({
      newNoteName: e.target.value
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
        <div>
          <input className="form-control"
                 type="text"
                 ref="noteName"
                 placeholder="Titre de la note"
                 value={this.state.newNoteName}
                 onChange={this.updateNewNoteName.bind(this)} />

          <textarea className="form-control"
                    ref="noteText"
                    value={this.state.newNoteText}
                    placeholder="Contenu"
                    onChange={this.updateNewNoteText.bind(this)} />

          <div className="actions">
            <button className="btn btn-default"
                    onClick={this.cancel.bind(this)}>
              Annuler
            </button>

            <button className="btn btn-primary"
                    onClick={this.save.bind(this)}>
              Ajouter
            </button>
          </div>
        </div>
      )
    }
  }

}
