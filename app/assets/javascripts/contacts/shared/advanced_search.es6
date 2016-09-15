import ItemsSelect from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {
  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value

    this.setState(newFilters, () => {
      this.props.updateAdvancedSearchFilters(newFilters);
    })
  }

  updateActive(value, e) {
    this.setState({ active: value }, () => {
      this.props.updateAdvancedSearchFilters({
        active: value
      });
    })
  }

  updateOrganizationIds(value) {
    this.props.updateAdvancedSearchFilters({
      organizationIds: value
    });
  }

  updateFieldIds(value) {
    this.props.updateAdvancedSearchFilters({
      fieldIds: value
    });
  }

  updateEventIds(value) {
    this.props.updateAdvancedSearchFilters({
      eventIds: value
    });
  }

  updateProjectIds(value) {
    this.props.updateAdvancedSearchFilters({
      projectIds: value
    });
  }

  render() {
    return (
      <div>
        <h3>Recherche avancée</h3>
        <h4>Général</h4>

        {this.renderNameFilter()}
        {this.renderEmailFilter()}
        {this.renderAddressFilter()}
        {this.renderPhoneFilter()}
        {this.renderNotesFilter()}
        {this.renderActiveInactiveFilter()}
        {this.renderOrganizationsFilter()}
        {this.renderFieldsFilter()}
        {this.renderEventsFilter()}
        {this.renderProjectsFilter()}
      </div>
    );
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="contacts_name">Nom</label><br />
        <input type="text"
               id="contacts_name"
               value={this.props.filters.name}
               onChange={this.updateTextFilter.bind(this, 'name')} />
      </div>
    );
  }

  renderEmailFilter() {
    return (
      <div>
        <label htmlFor="contacts_email">Email</label><br />
        <input type="text"
               id="contacts_email"
               value={this.props.filters.email}
               onChange={this.updateTextFilter.bind(this, 'email')} />
      </div>
    );
  }

  renderAddressFilter() {
    return (
      <div>
        <label htmlFor="contacts_address">Adresse</label><br />
        <input type="text"
               id="contacts_address"
               value={this.props.filters.address}
               onChange={this.updateTextFilter.bind(this, 'address')} />
      </div>
    );
  }

  renderPhoneFilter() {
    return (
      <div>
        <label htmlFor="contacts_phone">Téléphone</label><br />
        <input type="text"
               id="contacts_phone"
               value={this.props.filters.phone}
               onChange={this.updateTextFilter.bind(this, 'phone')} />
      </div>
    );
  }

  renderNotesFilter() {
    return (
      <div>
        <label htmlFor="contacts_notes">Notes</label><br />
        <input type="text"
               id="contacts_notes"
               value={this.props.filters.notes}
               onChange={this.updateTextFilter.bind(this, 'notes')} />
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
                 checked={this.props.filters.active == undefined}
                 onChange={this.updateActive.bind(this, undefined)} />

          &nbsp;<label htmlFor="contacts_active_all">Tous</label>
        </div>

        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_active"
                 checked={this.props.filters.active == true}
                 onChange={this.updateActive.bind(this, true)} />

          &nbsp;<label htmlFor="contacts_active_active">Actif</label>
        </div>

        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_inactive"
                 checked={this.props.filters.active == false}
                 onChange={this.updateActive.bind(this, false)} />

          &nbsp;<label htmlFor="contacts_active_inactive">Inactif</label>
        </div>
      </div>
    )
  }

  renderOrganizationsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.organizationIds}
                   optionsPath={this.props.organizationOptionsPath}
                   updateValue={this.updateOrganizationIds.bind(this)}
                   label="Organisations" />
    );
  }

  renderFieldsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.fieldIds}
                   optionsPath={this.props.fieldOptionsPath}
                   updateValue={this.updateFieldIds.bind(this)}
                   label="Domaines d'expertise" />
    );
  }

  renderEventsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.eventIds}
                   optionsPath={this.props.eventOptionsPath}
                   updateValue={this.updateEventIds.bind(this)}
                   label="Évènements" />
    );
  }

  renderProjectsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.projectIds}
                   optionsPath={this.props.projectOptionsPath}
                   updateValue={this.updateProjectIds.bind(this)}
                   label="Projets" />
    );
  }

}

module.exports = AdvancedSearch
