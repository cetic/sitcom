import DateRangeFilter from '../../shared/date_range_filter.es6'
import ItemsSelect     from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value
    this.props.updateFilters(newFilters)
  }

  updateContactIds(value) {
    this.props.updateFilters({
      contactIds: value
    })
  }

  render() {
    return (
      <div>
        {this.renderNameFilter()}
        {this.renderDescriptionFilter()}
        {this.renderNotesFilter()}
        {this.renderDatesFilter()}
        {this.renderContactsFilter()}
      </div>
    )
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="projects_name">Nom</label><br />
        <input type="text"
               id="projects_name"
               value={this.props.filters.name}
               onChange={this.updateTextFilter.bind(this, 'name')} />
      </div>
    )
  }

  renderDescriptionFilter() {
    return (
      <div>
        <label htmlFor="projects_description">Description</label><br />
        <input type="text"
               id="projects_description"
               value={this.props.filters.description}
               onChange={this.updateTextFilter.bind(this, 'description')} />
      </div>
    )
  }

  renderNotesFilter() {
    return (
      <div>
        <label htmlFor="projects_notes">Notes</label><br />
        <input type="text"
               id="projects_notes"
               value={this.props.filters.notes}
               onChange={this.updateTextFilter.bind(this, 'notes')} />
      </div>
    )
  }

  renderDatesFilter() {
    return (
      <DateRangeFilter filters={this.props.filters}
                       updateFilters={this.props.updateFilters} />
    )
  }

  renderContactsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.contactIds}
                   optionsPath={this.props.contactOptionsPath}
                   updateValue={this.updateContactIds.bind(this)}
                   label="Contacts" />
    )
  }

}

module.exports = AdvancedSearch
