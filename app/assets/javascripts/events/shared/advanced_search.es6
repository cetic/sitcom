import BaseAdvancedSearch from '../../shared/base/base_advanced_search.es6'
import DateRangeFilter    from '../../shared/date_range_filter.es6'

class AdvancedSearch extends BaseAdvancedSearch {

  constructor(props) {
    super(props)
    this.itemType = 'event'
  }

  render() {
    return (
      <div className="advanced-search form-horizontal">
        <fieldset>
          <legend>Général</legend>
          {this.renderSimpleFilter('name',        'Nom'        )}
          {this.renderSimpleFilter('place',       'Lieu'       )}
          {this.renderSimpleFilter('description', 'Description')}
          {this.renderSimpleFilter('notes',       'Notes'      )}
        </fieldset>

        <fieldset>
          <legend>Intervalle de dates</legend>
          {this.renderHappensOnFilter()}
        </fieldset>

        <fieldset>
          <legend>Associations</legend>
          {this.renderIdsListFilter('contact', 'Contacts')}
        </fieldset>

        {this.renderCustomFieldsFilters()}
      </div>
    )
  }

  renderHappensOnFilter() {
    return (
      <div className="dates-filter form-group">
        <div className="col-sm-12 dates-filter-pickers">
          <DateRangeFilter filters={this.props.filters}
                           updateFilters={this.props.updateFilters} />
        </div>
      </div>
    )
  }

}

module.exports = AdvancedSearch
