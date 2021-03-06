export default class NewItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fieldValue:  '',
      errors:      '',
      loading:     false
    }
  }

  componentDidMount() {
    this.bindFocusOnInput()
  }

  reset() {
    this.setState({
      fieldValue:  '',
      errors:      ''
    })
  }

  bindFocusOnInput() {
    $('.' + this.props.modalClassName).on('shown.bs.modal', () => {
      $(this.refs.name).focus()
    })
  }

  hideModal() {
    $('.' + this.props.modalClassName).modal('hide')
  }

  updateField(e) {
    this.setState({ fieldValue: e.target.value })
  }

  backendCreateNewItemAndRedirect(e) {
    e.preventDefault()

    if(this.state.fieldValue != '') {
      var params = {}
      params[this.props.modelName] = {}
      params[this.props.modelName][this.props.fieldName] = this.state.fieldValue

      http.post(this.props.itemsPath, params, (data) => {
        if(!data.success) {
          if(data.quotaReached) {
            this.hideModal()
            this.reset()
            $('.quota-modal').modal('show')
          }
          else {
            this.setState({ errors: data.errors })
          }
        }
        else {
          var id = data[`${this.props.modelName}Id`]
          this.props.router.push(`${this.props.modelName}s/${id}`)
          this.hideModal()

          this.setState({
            fieldValue: '',
            loading:    false,
            errors:     []
          })
        }
      })
    }
  }

  render() {
    var modalClasses = "modal fade " + this.props.modalClassName

    return (
      <div className={modalClasses} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={this.backendCreateNewItemAndRedirect.bind(this)}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">{ this.props.modalTitle }</h4>
              </div>
              <div className="modal-body">
                <div className="form-horizontal">
                  { this.renderErrors() }

                  <div className="form-group">
                    <label className="control-label col-md-4" htmlFor="name">
                      { this.props.fieldTitle }
                    </label>
                    <div className="col-md-8">
                      <input value={this.state.fieldValue}
                             onChange={this.updateField.bind(this)}
                             ref="name"
                             className="form-control"
                             required="required"
                             type="text"
                             id="name"/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.reset.bind(this)}>Fermer</button>
                <input  type="submit" className="btn btn-primary" disabled={this.state.loading} value="Créer"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  renderErrors() {
    if(this.state.errors.length) {
      return (
        <div className="alert alert-danger" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          { this.state.errors }
        </div>
      )
    }
  }
}
