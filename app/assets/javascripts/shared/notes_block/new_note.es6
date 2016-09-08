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
        <a href="javascript:;" onClick={this.open.bind(this)}>New note</a>
      )
    }
  }

  renderForm() {
    if(this.state.open) {
      return (
        <form>
          <textarea value={this.state.newNoteText} onChange={this.updateNewNoteText.bind(this)} />

          <a href="javascript:;" onClick={this.cancel.bind(this)}>Cancel</a>
        </form>
      )
    }
  }

}

module.exports = NewNote
