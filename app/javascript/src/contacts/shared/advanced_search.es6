import BaseAdvancedSearch from '../../shared/base/base_advanced_search.es6'

class AdvancedSearch extends BaseAdvancedSearch {

  constructor(props) {
    super(props)
    this.itemType = 'contact'
  }

  updateActiveFilter(value) {
    this.props.updateFilters({
      active: value
    })
  }

  render() {
    return (
      <div className="advanced-search form-horizontal">
        <fieldset>
          <legend>Général</legend>
          {this.renderSimpleFilter('name',    'Nom'      )}
          {this.renderSimpleFilter('email',   'Email'    )}
          {this.renderSimpleFilter('address', 'Adresse'  )}
          {this.renderSimpleFilter('phone',   'Téléphone')}
          {this.renderSimpleFilter('notes',   'Notes'    )}
          {this.renderActiveFilter()}
        </fieldset>

        <fieldset>
          <legend>Associations</legend>
          {this.renderIdsListFilter('tag',          'Tags'         )}
          {this.renderIdsListFilter('field',        'Expertises'   )}
          {this.renderIdsListFilter('organization', 'Organisations')}
          {this.renderIdsListFilter('project',      'Projets'      )}
          {this.renderIdsListFilter('event',        'Evènements'   )}
        </fieldset>

        {this.renderCustomFieldsFilters()}
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
                 onChange={this.updateActiveFilter.bind(this, '')} />

          &nbsp;<label htmlFor="contacts_active_all">Tous</label>

          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_active"
                 checked={this.props.filters.active == 'true'}
                 onChange={this.updateActiveFilter.bind(this, 'true')} />

          &nbsp;<label htmlFor="contacts_active_active">Actif</label>

          <input type="radio"
                 name="contacts_active"
                 id="contacts_active_inactive"
                 checked={this.props.filters.active == 'false'}
                 onChange={this.updateActiveFilter.bind(this, 'false')} />

          &nbsp;<label htmlFor="contacts_active_inactive">Inactif</label>
        </div>
      </div>
    )
  }

}

module.exports = AdvancedSearch
