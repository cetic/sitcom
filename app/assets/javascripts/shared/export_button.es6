import ParamsService from './params_service.es6'

class ExportButton extends React.Component {

  export() {
    var filterParams = humps.decamelizeKeys(this.props.filterParams)
    var queryString  = ParamsService.rejectEmptyParams($.param(filterParams))
    var url          = `${this.props.exportUrl}?${queryString}`

    window.open(url, '_blank')
  }

  render() {
    var classes = 'fa fa-cloud-download'
    classes = this.props.exportUrl ? classes : classes + ' disabled'

    return (
      <i className={classes}
         title="Exporter la sélection"
         onClick={this.export.bind(this)}>
      </i>
    )
  }
}

module.exports = ExportButton
