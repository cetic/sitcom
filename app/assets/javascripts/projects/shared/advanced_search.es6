import BaseAdvancedSearch from '../../shared/base/base_advanced_search.es6'
import DateRangeFilter    from '../../shared/date_range_filter.es6'

class AdvancedSearch extends BaseAdvancedSearch {

  constructor(props) {
    super(props)
    this.itemType = 'project'
  }

  render() {
    return (
      <div className="advanced-search form-horizontal">
        <fieldset>
          <legend>Général</legend>

          {this.renderSimpleFilter('name',        'Nom'        )}
          {this.renderSimpleFilter('description', 'Description')}
          {this.renderSimpleFilter('notes',       'Notes'      )}
        </fieldset>

        {this.renderDatesFilter()}

        <fieldset>
          <legend>Associations</legend>

          {this.renderIdsListFilter('contact', 'Contacts')}
        </fieldset>
      </div>
    )
  }

  renderDatesFilter() {
    return (
      <DateRangeFilter filters={this.props.filters}
                       updateFilters={this.props.updateFilters} />
    )
  }

}

module.exports = AdvancedSearch
