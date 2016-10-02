import BaseAdvancedSearch    from '../../shared/base/base_advanced_search.es6'
import TextCustomFieldFilter from './advanced_search/text_custom_field_filter.es6'
import BoolCustomFieldFilter from './advanced_search/bool_custom_field_filter.es6'
import EnumCustomFieldFilter from './advanced_search/enum_custom_field_filter.es6'

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
          {this.renderIdsListFilter('tag',          'Groupes'      )}
          {this.renderIdsListFilter('field',        'Expertises'   )}
          {this.renderIdsListFilter('organization', 'Organisations')}
          {this.renderIdsListFilter('project',      'Projets'      )}
          {this.renderIdsListFilter('event',        'Evènements'   )}
        </fieldset>

        <fieldset>
          <legend>Champs personnalisés</legend>
          {this.renderCustomFieldsFilters()}
        </fieldset>
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

  renderCustomFieldsFilters() {
    return _.map(this.props.contactCustomFields, (customField) => {
      return this.renderCustomFieldFilter(customField)
    })
  }

  renderCustomFieldFilter(customField) {
    if(customField.fieldType == 'text') {
      return (
        <TextCustomFieldFilter key={customField.id}
                               customField={customField}
                               filters={this.props.filters}
                               updateFilters={this.props.updateFilters} />
      )
    }
    else if(customField.fieldType == 'bool') {
      return (
        <BoolCustomFieldFilter key={customField.id}
                               customField={customField}
                               filters={this.props.filters}
                               updateFilters={this.props.updateFilters} />
      )
    }
    else if(customField.fieldType == 'enum') {
      return (
        <EnumCustomFieldFilter key={customField.id}
                               customField={customField}
                               filters={this.props.filters}
                               updateFilters={this.props.updateFilters} />
      )
    }
  }

}

module.exports = AdvancedSearch
