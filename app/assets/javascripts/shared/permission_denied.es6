class PermissionDenied extends React.Component {

  goBack() {
    window.history.back()
  }

  render() {
    return (
      <div className="container container-main permission-denied">
        <div className="row">
          <div className="panel col-md-6 col-md-offset-3">
            <p>Vous n'avez pas accès à cette page.</p>
            <a href="javascript:;" className="btn btn-xs" onClick={this.goBack.bind(this)}>Retour</a>
          </div>
        </div>
      </div>
    )
  }

}

module.exports = PermissionDenied
