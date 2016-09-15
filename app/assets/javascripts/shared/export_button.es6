import ParamsService from './params_service.es6'

class ExportButton extends React.Component {

  export() {
    var filters     = humps.decamelizeKeys(this.props.filters)
    var queryString = ParamsService.rejectEmptyParams($.param(filters))
    var url         = `${this.props.exportUrl}?${queryString}`

    window.open(url, '_blank')
  }

  render() {
    return (
      <i className="fa fa-cloud-download"
         title="Exporter la sélection"
         onClick={this.export.bind(this)}>
      </i>
    )
  }
}

module.exports = ExportButton
