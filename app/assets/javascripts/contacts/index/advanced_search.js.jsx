import FieldsFilter        from './fields_filter.js.jsx'
import OrganizationsFilter from './organizations_filter.js.jsx'
import EventsFilter        from './events_filter.js.jsx'
import ProjectsFilter      from './projects_filter.js.jsx'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);

    var activeFilter;

    if(this.props.filters.active == 'true') {
      activeFilter = true;
    }
    else if(this.props.filters.active == 'false') {
      activeFilter = false;
    }

    this.state = {
      name:    this.props.filters.name   || '',
      email:   this.props.filters.email  || '',
      address: this.props.filters.address|| '',
      phone:   this.props.filters.phone  || '',
      active:  activeFilter
    };
  }

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
        {this.renderActiveInactiveFilter()}

        <OrganizationsFilter organizationIds={this.props.filters.organizationIds}
                             organizationOptionsPath={this.props.organizationOptionsPath}
                             updateOrganizationIds={this.updateOrganizationIds.bind(this)} />

        <FieldsFilter fieldIds={this.props.filters.fieldIds}
                      fieldOptionsPath={this.props.fieldOptionsPath}
                      updateFieldIds={this.updateFieldIds.bind(this)} />

        <EventsFilter eventIds={this.props.filters.eventIds}
                      eventOptionsPath={this.props.eventOptionsPath}
                      updateEventIds={this.updateEventIds.bind(this)} />

        <ProjectsFilter projectIds={this.props.filters.projectIds}
                        projectOptionsPath={this.props.projectOptionsPath}
                        updateProjectIds={this.updateProjectIds.bind(this)} />
      </div>
    );
  }

  renderNameFilter() {
    return (
      <div>
        <label htmlFor="contacts_name">Nom</label><br />
        <input type="text"
               id="contacts_name"
               value={this.state.name}
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
               value={this.state.email}
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
               value={this.state.address}
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
               value={this.state.phone}
               onChange={this.updateTextFilter.bind(this, 'phone')} />
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
