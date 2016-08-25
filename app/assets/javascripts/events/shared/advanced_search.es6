class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.filters.name        || '',
      description: this.props.filters.description || ''
    };
  }

  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateAdvancedSearchFilters(newFilters);
    })
  }

  render() {
    return (
      <div>
        <h3>Recherche avancée</h3>
        <h4>Général</h4>

        {this.renderNameFilter()}
        {this.renderDescriptionFilter()}
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
}

module.exports = AdvancedSearch
