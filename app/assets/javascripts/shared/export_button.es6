import ParamsService from './params_service.es6'

class ExportButton extends React.Component {

  export() {
    var filterParams = humps.decamelizeKeys(this.props.filterParams)
    var queryString  = ParamsService.rejectEmptyParams($.param(filterParams))
    var url          = `${this.props.exportUrl}?${queryString}`

    window.open(url, '_blank')
  }

  render() {
    return (
      <button className="btn btn-primary export"
              onClick={this.export.bind(this)}>
        Exporter
      </button>
    )
  }

}

module.exports = ExportButton
