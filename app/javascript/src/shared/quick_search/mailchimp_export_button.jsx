import ParamsService from '../params_service.jsx'

import Modal from './mailchimp_export_button/modal.jsx'

export default class MailchimpExportButton extends React.Component {

  export(listName) {
    const selectedIds = this.props.selectedIds ? this.props.selectedIds : undefined

    var url

    if(selectedIds && selectedIds.length) {
      url = `${this.props.mailchimpExportUrl}?ids=${selectedIds.join(',')}`
    }
    else {
      var filters     = humps.decamelizeKeys(this.props.filters)
      var queryString = ParamsService.rejectEmptyParams($.param(filters))
      url             = `${this.props.mailchimpExportUrl}?${queryString}`
    }

    const params = {
      listName: listName
    }

    $.post(url, humps.decamelizeKeys(params), () =>
      alert("Les contacts seront importés sur Mailchimp d'ici quelques minutes.")
    )
  }

  openModal() {
    $('.new-mailchimp-list-modal').modal('show')
  }

  render() {
    var classes = 'fa fa-envelope-o'
    classes     = this.props.mailchimpExportUrl ? classes : classes + ' disabled'

    return (
      <div>
        <i className={classes}
           title="Créer une liste Mailchimp"
           onClick={this.openModal.bind(this)}>
        </i>

        {this.renderModal()}
      </div>
    )
  }

  renderModal() {
    return (
      <Modal export={this.export.bind(this)} />
    )
  }

}
