import ItemsSelect   from '../../shared/items_select.es6'

class AdvancedSearch extends React.Component {
  updateTextFilter(filterName, e) {
    var newFilters = {}
    newFilters[filterName] = e.target.value
    this.props.updateFilters(newFilters)
  }

  updateActive(value) {
    this.props.updateFilters({
      active: value
    })
  }

  updateOrganizationIds(value) {
    this.props.updateFilters({
      organizationIds: value
    })
  }

  updateProjectIds(value) {
    this.props.updateFilters({
      projectIds: value
    })
  }

  updateEventIds(value) {
    this.props.updateFilters({
      eventIds: value
    })
  }

  updateFieldIds(value) {
    this.props.updateFilters({
      fieldIds: value
    })
  }

  updateTagIds(value) {
    this.props.updateFilters({
      tagIds: value
    })
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
        {this.renderActiveFilter()}
        {this.renderTagsFilter()}
        {this.renderFieldsFilter()}
        {this.renderOrganizationsFilter()}
        {this.renderProjectsFilter()}
        {this.renderEventsFilter()}
      </div>
    )
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
    )
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
    )
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
    )
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
    )
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
    )
  }

  renderActiveFilter() {
    return (
      <div>
        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_all"
                 checked={this.props.filters.active == ''}
                 onChange={this.updateActive.bind(this, '')} />

          &nbsp;<label htmlFor="contacts_active_all">Tous</label>
        </div>

        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_active"
                 checked={this.props.filters.active == 'true'}
                 onChange={this.updateActive.bind(this, 'true')} />

          &nbsp;<label htmlFor="contacts_active_active">Actif</label>
        </div>

        <div>
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_inactive"
                 checked={this.props.filters.active == 'false'}
                 onChange={this.updateActive.bind(this, 'false')} />

          &nbsp;<label htmlFor="contacts_active_inactive">Inactif</label>
        </div>
      </div>
    )
  }

  renderTagsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.tagIds}
                   optionsPath={this.props.tagOptionsPath}
                   updateValue={this.updateTagIds.bind(this)}
                   label="Groupes" />
    )
  }

  renderFieldsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.fieldIds}
                   optionsPath={this.props.fieldOptionsPath}
                   updateValue={this.updateFieldIds.bind(this)}
                   label="Domaines d'expertise" />
    )
  }

  renderOrganizationsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.organizationIds}
                   optionsPath={this.props.organizationOptionsPath}
                   updateValue={this.updateOrganizationIds.bind(this)}
                   label="Organisations" />
    )
  }

  renderProjectsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.projectIds}
                   optionsPath={this.props.projectOptionsPath}
                   updateValue={this.updateProjectIds.bind(this)}
                   label="Projets" />
    )
  }

  renderEventsFilter() {
    return (
      <ItemsSelect itemIds={this.props.filters.eventIds}
                   optionsPath={this.props.eventOptionsPath}
                   updateValue={this.updateEventIds.bind(this)}
                   label="Évènements" />
    )
  }

}

module.exports = AdvancedSearch
