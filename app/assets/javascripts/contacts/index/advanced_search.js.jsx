class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: this.props.filters.active
    };
  }

  updateActive(value, e) {
    this.setState({ active: value }, () => {
      this.props.updateAdvancedSearchFilter('active', value);
    })
  }

  render() {
    return (
      <div>
        <h3>Recherche avancée</h3>
        {this.renderActiveInactiveFilter()}
      </div>
    );
  }

  renderActiveInactiveFilter() {
    return (
      <div>
        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_all"
                 checked={this.state.active == undefined}
                 onChange={this.updateActive.bind(this, undefined)} />

          &nbsp;<label htmlFor="contacts_active_all">Tous</label>
        </div>

        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_active"
                 checked={this.state.active == true}
                 onChange={this.updateActive.bind(this, true)} />

          &nbsp;<label htmlFor="contacts_active_active">Actif</label>
        </div>

        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_inactive"
                 checked={this.state.active == false}
                 onChange={this.updateActive.bind(this, false)} />

          &nbsp;<label htmlFor="contacts_active_inactive">Inactif</label>
        </div>
      </div>
    )
  }
}

module.exports = AdvancedSearch
