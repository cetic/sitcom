class Modal extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      name:   '',
      errors: ''
    }
  }

  componentDidMount() {
    this.bindFocusOnInput()
  }

  bindFocusOnInput() {
    $('.new-mailchimp-list-modal').on('shown.bs.modal', () => {
      $(this.refs.name).focus()
    })
  }

  hideModal() {
    $('.new-mailchimp-list-modal').modal('hide')
  }

  updateName(e) {
    this.setState({ name: e.target.value })
  }

  export(e) {
    e.preventDefault()

    if(_.trim(this.state.name).length) {
      this.props.export(_.trim(this.state.name))
      this.hideModal()
    }
  }

  render() {
    return (
      <div className="modal new-mailchimp-list-modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={this.export.bind(this)}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>

                <h4 className="modal-title">Nouvelle liste Mailchimp</h4>
              </div>

              <div className="modal-body">
                <div className="form-horizontal">
                  {this.renderNameField()}
                </div>

                <div className="alert alert-info">
                  <strong>Remarque:</strong> dans Mailchimp, la liste apparaît immédiatement mais les contacts peuvent prendre quelques minutes à être ajoutés par leur système.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                <input  type="submit" className="btn btn-primary" value="Créer la liste"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  renderNameField() {
    return (
      <div className="form-group">
        <label className="control-label col-md-4" htmlFor="last-name">
          Nom
        </label>
        <div className="col-md-8">
          <input value={this.state.name}
                 onChange={this.updateName.bind(this)}
                 ref="name"
                 className="form-control"
                 required="required"
                 type="text"
                 id="name"/>
        </div>
      </div>
    )
  }

}

module.exports = Modal
