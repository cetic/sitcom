class NewContact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName:  '',
      errors:    ''
    }
  }

  componentDidMount() {
    this.bindFocusOnInput()
  }

  bindFocusOnInput() {
    $('.new-contact-modal').on('shown.bs.modal', () => {
      $(this.refs.firstName).focus()
    })
  }

  hideModal() {
    $('.new-contact-modal').modal('hide')
  }

  updateFirstName(e) {
    this.setState({ firstName: e.target.value })
  }

  updateLastName(e) {
    this.setState({ lastName: e.target.value })
  }

  backendCreateNewContactAndRedirect(e) {
    e.preventDefault()

    if(this.state.firstName != '' && this.state.lastName != '') {
      var params = {
        contact: {
          firstName: this.state.firstName,
          lastName:  this.state.lastName
        }
      }

      http.post(this.props.contactsPath, params, (data) => {
        if(!data.success) {
          this.setState({ errors: data.errors })
        }
        else {
          setTimeout(() => {
            this.props.router.push(`contacts/${data.contact.id}`)
            this.hideModal()
            this.setState({
              firstName: '',
              lastName:  ''
            })
          }, window.backendRefreshDelay)
        }
      })
    }
  }

  render() {
    return (
      <div className="modal new-contact-modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={this.backendCreateNewContactAndRedirect.bind(this)}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Nouveau contact</h4>
              </div>
              <div className="modal-body">
                <div className="form-horizontal">
                  { this.renderErrors() }

                  <div className="form-group">
                    <label className="control-label col-md-4" htmlFor="first-name">
                      Prénom
                    </label>
                    <div className="col-md-8">
                      <input value={this.state.firstName}
                             onChange={this.updateFirstName.bind(this)}
                             ref="firstName"
                             className="form-control"
                             required="required"
                             type="text"
                             id="first-name"/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-4" htmlFor="last-name">
                      Nom
                    </label>
                    <div className="col-md-8">
                      <input value={this.state.lastName}
                             onChange={this.updateLastName.bind(this)}
                             ref="lastName"
                             className="form-control"
                             required="required"
                             type="text"
                             id="last-name"/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                <input  type="submit" className="btn btn-primary" value="Créer"/>
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
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>

          { this.state.errors }
        </div>
      )
    }
  }
}

module.exports = NewContact
