import StatusSelect from './status_select.es6'
import ItemsSelect  from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.filters.name        || '',
      status:      this.props.filters.status      || '',
      description: this.props.filters.description || '',
      websiteUrl:  this.props.filters.websiteUrl  || '',
      notes:       this.props.filters.notes       || ''
    };
  }

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateFilters(newFilters);
    })
  }

  updateStatusFilter(value) {
    this.props.updateFilters({
      status: value
    });
  }

  updateContactIds(value) {
    this.props.updateFilters({
      contactIds: value
    });
  }

  render() {
    return (
      <div>
        <h3>Recherche avancée</h3>
        <h4>Général</h4>

        {this.renderNameFilter()}
        {this.renderStatusFilter()}
        {this.renderDescriptionFilter()}
        {this.renderWebsiteUrlFilter()}
        {this.renderNotesFilter()}
        {this.renderContactsFilter()}
      </div>
    );
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="organizations_name">Nom</label><br />
        <input type="text"
               id="organizations_name"
               value={this.state.name}
               onChange={this.updateTextFilter.bind(this, 'name')} />
      </div>
    );
  }

  renderStatusFilter() {
    return (
      <div>
        <label htmlFor="organizations_status">Statut</label><br />

        <StatusSelect optionsPath={this.props.organizationStatusesOptionsPath}
                      value={this.state.status}
                      updateValue={this.updateStatusFilter.bind(this)} />
      </div>
    );
  }

  renderDescriptionFilter() {
    return (
      <div>
        <label htmlFor="organizations_description">Description</label><br />
        <input type="text"
               id="organizations_description"
               value={this.state.description}
               onChange={this.updateTextFilter.bind(this, 'description')} />
      </div>
    );
  }

  renderWebsiteUrlFilter() {
    return (
      <div>
        <label htmlFor="organizations_website_url">Site Web</label><br />
        <input type="text"
               id="organizations_website_url"
               value={this.state.websiteUrl}
               onChange={this.updateTextFilter.bind(this, 'websiteUrl')} />
      </div>
    );
  }

  renderNotesFilter() {
    return (
      <div>
        <label htmlFor="organizations_notes">Notes</label><br />
        <input type="text"
               id="organizations_notes"
               value={this.state.notes}
               onChange={this.updateTextFilter.bind(this, 'notes')} />
      </div>
    );
  }

  renderContactsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.contactIds}
                   optionsPath={this.props.contactOptionsPath}
                   updateValue={this.updateContactIds.bind(this)}
                   label="Contacts" />
    );
  }

}

module.exports = AdvancedSearch
