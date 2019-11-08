import ParamsService from './params_service.jsx'

export default class ExportButton extends React.Component {

  export() {
    var selectedIds = this.props.selectedIds ? this.props.selectedIds : undefined
    var url

    if(selectedIds && selectedIds.length) {
      url = `${this.props.exportUrl}?ids=${selectedIds.join(',')}`
    }
    else {
      var filters     = humps.decamelizeKeys(this.props.filters)
      var queryString = ParamsService.rejectEmptyParams($.param(filters))
      url             = `${this.props.exportUrl}?${queryString}`
    }

    window.open(url, '_blank')
  }

  render() {
    return (
      <i className="fa fa-file-excel-o"
         title="Exporter la sélection"
         onClick={this.export.bind(this)}>
      </i>
    )
  }

}
