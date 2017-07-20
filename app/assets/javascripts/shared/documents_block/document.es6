class Document extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode:    false,
      description: ''
    }
  }

  updateDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  remove() {
    if(confirm("Supprimer définitivement ce document ?")) {
      http.delete(`${this.props.document.path}`)
    }
  }

  edit() {
    this.setState({
      editMode:   true,
      description: this.props.document.description
    }, () => {
      $(this.refs.textarea).focus()
    })
  }

  save() {
    var params = {
      document: {
        description: this.state.description
      }
    }

    http.put(`${this.props.document.path}`, params, (data) => {
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
      <div className="document">
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if(this.state.editMode) {
      return (
        <div className="file-description edit">
          { this.renderFileName() }

          <div className="document-description">
            <textarea ref="textarea"
                      value={this.state.description}
                      onChange={this.updateDescription.bind(this)} />
          </div>

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
      var emptyClass  = this.props.document.description.length ? '' : 'empty'
      var description = this.props.document.description.length ? this.props.document.description : "Pas de description"

      return (
        <div className="file-description">
          { this.renderFileName() }

          <div className="document-description">
            <em className={emptyClass}>{ description }</em>
          </div>

          { this.renderButtons() }
        </div>
      )
    }
  }

  renderFileName() {
    return (
      <div className="document-name">
        <a href={this.props.document.path} target="_blank">
          <i className="fa fa-file"></i> { this.props.document.name }
        </a>
      </div>
    )
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

module.exports = Document
