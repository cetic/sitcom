import StatusSelect from './status_select.es6'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.filters.name        || '',
      status:      this.props.filters.status      || '',
      description: this.props.filters.description || '',
      websiteUrl:  this.props.filters.websiteUrl  || ''
    };
  }

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateAdvancedSearchFilters(newFilters);
    })
  }

  updateStatusFilter(value) {
    this.props.updateAdvancedSearchFilters({
      status: value
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

    // <input type="text"
    //        id="organizations_status"
    //        value={this.state.status}
    //        onChange={this.updateTextFilter.bind(this, 'status')} />

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

}

module.exports = AdvancedSearch
