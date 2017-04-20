import ParamsService from '../params_service.es6'

class MailchimpExportButton extends React.Component {

  export() {
    const listName    = prompt("Nom de la liste Mailchimp à créer")
    const selectedIds = this.props.selectedIds ? this.props.selectedIds : undefined

    if(_.trim(listName).length) {
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

      $.post(url, humps.decamelizeKeys(params), () => {

      })
    }
  }

  render() {
    var classes = 'fa fa-envelope-o'
    classes = this.props.mailchimpExportUrl ? classes : classes + ' disabled'

    return (
      <i className={classes}
         title="Créer une liste Mailchimp"
         onClick={this.export.bind(this)}>
      </i>
    )
  }

}

module.exports = MailchimpExportButton
