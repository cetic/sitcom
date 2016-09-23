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

        {this.renderHappensOnFilter()}

        <fieldset>
          <legend>Associations</legend>

          {this.renderIdsListFilter('contact', 'Contacts')}
        </fieldset>
      </div>
    )
  }

  renderHappensOnFilter() {
    return (
      <DateRangeFilter filters={this.props.filters}
                       updateFilters={this.props.updateFilters} />
    )
  }

}

module.exports = AdvancedSearch
