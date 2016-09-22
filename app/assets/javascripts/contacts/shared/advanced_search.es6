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
      <div className="advanced-search form-horizontal">
        <fieldset>
          <legend>Général</legend>

          {this.renderNameFilter()}
          {this.renderEmailFilter()}
          {this.renderAddressFilter()}
          {this.renderPhoneFilter()}
          {this.renderNotesFilter()}
          {this.renderActiveFilter()}
        </fieldset>

        <fieldset>
          <legend>Associations</legend>

          {this.renderTagsFilter()}
          {this.renderFieldsFilter()}
          {this.renderOrganizationsFilter()}
          {this.renderProjectsFilter()}
          {this.renderEventsFilter()}
        </fieldset>
      </div>
    )
  }

  renderNameFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label"
               htmlFor="contacts_name">
          Nom
        </label>
        <div className="col-sm-9">
          <input className="form-control input-sm"
                 type="text"
                 id="contacts_name"
                 value={this.props.filters.name}
                 onChange={this.updateTextFilter.bind(this, 'name')} />
        </div>
      </div>
    )
  }

  renderEmailFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label"
               htmlFor="contacts_email">
          Email
        </label>
        <div className="col-sm-9">
          <input className="form-control input-sm"
                 type="text"
                 id="contacts_email"
                 value={this.props.filters.email}
                 onChange={this.updateTextFilter.bind(this, 'email')} />
        </div>
      </div>
    )
  }

  renderAddressFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label"
               htmlFor="contacts_address">
          Adresse
        </label>
        <div className="col-sm-9">
          <input className="form-control input-sm"
                 type="text"
                 id="contacts_address"
                 value={this.props.filters.address}
                 onChange={this.updateTextFilter.bind(this, 'address')} />
        </div>
      </div>
    )
  }

  renderPhoneFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label"
               htmlFor="contacts_phone">
          Téléphone
        </label>
        <div className="col-sm-9">
          <input className="form-control input-sm"
                 type="text"
                 id="contacts_phone"
                 value={this.props.filters.phone}
                 onChange={this.updateTextFilter.bind(this, 'phone')} />
        </div>
      </div>
    )
  }

  renderNotesFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label"
               htmlFor="contacts_notes">
          Notes
        </label>
        <div className="col-sm-9">
          <input className="form-control input-sm"
                 type="text"
                 id="contacts_notes"
                 value={this.props.filters.notes}
                 onChange={this.updateTextFilter.bind(this, 'notes')} />
        </div>
      </div>
    )
  }

  renderActiveFilter() {
    return (
      <div className="active-filter form-group">
        <label className="col-sm-3 control-label">
          État
        </label>

        <div className="col-sm-9 active-filter-choices">
          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_all"
                 checked={this.props.filters.active == ''}
                 onChange={this.updateActive.bind(this, '')} />

          &nbsp;<label htmlFor="contacts_active_all">Tous</label>

          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_active"
                 checked={this.props.filters.active == 'true'}
                 onChange={this.updateActive.bind(this, 'true')} />

          &nbsp;<label htmlFor="contacts_active_active">Actif</label>

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
      <div className="form-group">
        <label className="col-sm-3 control-label">
          Groupes
        </label>
        <div className="col-sm-9">
          <ItemsSelect itemIds={this.props.filters.tagIds}
                       optionsPath={this.props.tagOptionsPath}
                       updateValue={this.updateTagIds.bind(this)} />
        </div>
      </div>
    )
  }

  renderFieldsFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">
          Expertises
        </label>
        <div className="col-sm-9">
          <ItemsSelect itemIds={this.props.filters.fieldIds}
                       optionsPath={this.props.fieldOptionsPath}
                       updateValue={this.updateFieldIds.bind(this)} />
        </div>
      </div>
    )
  }

  renderOrganizationsFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">
          Organisations
        </label>
        <div className="col-sm-9">
          <ItemsSelect itemIds={this.props.filters.organizationIds}
                       optionsPath={this.props.organizationOptionsPath}
                       updateValue={this.updateOrganizationIds.bind(this)} />
        </div>
      </div>
    )
  }

  renderProjectsFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">
          Projets
        </label>
        <div className="col-sm-9">
          <ItemsSelect itemIds={this.props.filters.projectIds}
                       optionsPath={this.props.projectOptionsPath}
                       updateValue={this.updateProjectIds.bind(this)} />
        </div>
      </div>
    )
  }

  renderEventsFilter() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">
          Évènements
        </label>
        <div className="col-sm-9">
          <ItemsSelect itemIds={this.props.filters.eventIds}
                       optionsPath={this.props.eventOptionsPath}
                       updateValue={this.updateEventIds.bind(this)} />
        </div>
      </div>
    )
  }

}

module.exports = AdvancedSearch
