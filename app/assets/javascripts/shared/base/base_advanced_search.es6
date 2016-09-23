import ItemsSelect from '../../shared/items_select.es6'

class BaseAdvancedSearch extends React.Component {

  updateTextFilter(filterName, e) {
    var newFilters         = {}
    newFilters[filterName] = e.target.value
    this.props.updateFilters(newFilters)
  }

  updateIdsListFilter(fieldName, value) {
    var newFilters        = {}
    newFilters[fieldName] = value
    this.props.updateFilters(newFilters)
  }

  renderSimpleFilter(fieldName, labelName) {
    const fieldId = `${this.itemType()}_${fieldName}`

    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={fieldId}>{labelName}</label>

        <div className="col-sm-9">
          <input className="form-control input-sm"
                 type="text"
                 id={fieldId}
                 value={this.props.filters[fieldName]}
                 onChange={this.updateTextFilter.bind(this, fieldName)} />
        </div>
      </div>
    )
  }

  renderIdsListFilter(itemType, labelName) {
    const optionsPath = this.props[`${itemType}OptionsPath`]
    const fieldName   = `${itemType}Ids`

    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">{labelName}</label>

        <div className="col-sm-9">
          <ItemsSelect itemIds={this.props.filters[fieldName]}
                       optionsPath={optionsPath}
                       updateValue={this.updateIdsListFilter.bind(this, fieldName)} />
        </div>
      </div>
    )
  }

}

module.exports = BaseAdvancedSearch
