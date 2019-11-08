export default class PermissionDenied extends React.Component {

  goBack() {
    window.history.back()
  }

  render() {
    return (
      <div className="container container-main permission-denied">
        <div className="row">
          <div className="panel col-md-6 col-md-offset-3">
            <p>Vous n'avez pas accès à cette page.</p>
            <p><small>Veuillez contacter un administrateur de votre lab si vous pensez que ce n'est pas normal.</small></p>
            <p><a href="javascript:;" onClick={this.goBack.bind(this)}>Retour</a></p>
          </div>
        </div>
      </div>
    )
  }

}
