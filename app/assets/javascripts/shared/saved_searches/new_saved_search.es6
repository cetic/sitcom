class NewSavedSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name:    '',
      public:  true,
      errors:  ''
    }
  }

  componentDidMount() {
    this.bindFocusOnInput()
  }

  bindFocusOnInput() {
    $(`.${this.props.modalClassName}`).on('shown.bs.modal', () => {
      $(this.refs.name).focus()
    })
  }

  hideModal() {
    $(`.${this.props.modalClassName}`).modal('hide')
  }

  updateName(e) {
    this.setState({ name: e.target.value })
  }

  updatePublic(value) {
    this.setState({ public: value })
  }

  backendCreateSavedSearch(e) {
    e.preventDefault()

    if(_.trim(this.state.name).length) {
      var params = {
        savedSearch: {
          name:   this.state.name,
          search: this.props.search
        },

        public: this.state.public
      }

      http.post(this.props.savedSearchesPath, params, (data) => {
        if(data.success) {
          this.props.reloadFromBackend(() => {
            this.props.setSelectedId(data.savedSearch.id)
            this.cancel()
          })
        }
      })
    }
  }

  cancel() {
    this.setState({
      name:   '',
      public: true
    }, () => {
      this.props.unsetFormMode()
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.backendCreateSavedSearch.bind(this)}>
          <div className="form-horizontal">
            { this.renderErrors() }

            <div className="form-group">
              <label className="control-label col-md-4" htmlFor="name">Nom de la recherche</label>

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

            <div className="form-group">
              <label className="control-label col-md-4" htmlFor="ownerId">Visibilité</label>

              <div className="col-md-8">
                <div>
                  <input type="radio"
                         name="saved-searches-public"
                         id="saved-searches-public-true"
                         checked={this.state.public}
                         onChange={this.updatePublic.bind(this, true)} />

                  &nbsp;<label htmlFor="saved-searches-public-true">Publique</label>
                </div>

                <div>
                  <input type="radio"
                         name="saved-searches-public"
                         id="saved-searches-public-false"
                         checked={!this.state.public}
                         onChange={this.updatePublic.bind(this, false)} />

                  &nbsp;<label htmlFor="saved-searches-public-false">Uniquement pour moi</label>
                </div>

                <a href="javascript:;"
                   className="btn btn-default btn-primary btn-success"
                   onClick={this.backendCreateSavedSearch.bind(this)}>Enregistrer</a>

                <a href="javascript:;"
                   onClick={this.cancel.bind(this)}>Annuler</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  renderErrors() {
    if(this.state.errors.length) {
      return (
        <div className="alert alert-danger" role="alert">
          <button type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>

          { this.state.errors }
        </div>
      )
    }
  }
}

module.exports = NewSavedSearch
