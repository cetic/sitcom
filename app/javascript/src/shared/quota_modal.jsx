export default class QuotaModal extends React.Component {

  hideModal() {
    $('.quota-modal').modal('hide')
  }

  render() {
    return (
      <div className="modal quota-modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>

              <h4 className="modal-title">Quota atteint</h4>
            </div>

            <div className="modal-body">
              <p>Dans sa version gratuite, SitCom vous donne accès à la plateforme et vous pouvez encoder un nombre illimité de contacts et organisations, vous pouvez gérer jusqu'à <strong>deux projets</strong> et <strong>quatre évènements</strong>.</p>
              <p>Avec un abonnement, proposé au prix de <strong>240€ (HTVA)</strong> par an, vous aurez un accès illimité à la plateforme et l'activation de la fonctionnalité mailing.</p>
              <p>Vous souhaitez souscrire à un abonnement ? Contactez-nous à <a href="mailto:info@livinglabsinwallonia.be">info@livinglabsinwallonia.be</a>.</p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
