import BaseAdvancedSearch from '../../shared/base/base_advanced_search.jsx'
import StatusSelect       from './status_select.jsx'

export default class AdvancedSearch extends BaseAdvancedSearch {

  constructor(props) {
    super(props)
    this.itemType = 'organization'
  }

  updateStatusFilter(value) {
    this.props.updateFilters({
      status: value
    })
  }

  render() {
    return (
      <div className="advanced-search form-horizontal">
        <fieldset>
          <legend>Général</legend>
          {this.renderSimpleFilter('name', 'Nom' )}

          {this.renderStatusFilter()}

          {this.renderSimpleFilter('companyNumber', "Num. d'entreprise")}
          {this.renderSimpleFilter('description',   'Description')}
          {this.renderSimpleFilter('address',       'Adresse'    )}
          {this.renderSimpleFilter('websiteUrl',    'Site Web'   )}
          {this.renderSimpleFilter('notes',         'Notes'      )}
        </fieldset>

        <fieldset>
          <legend>Associations</legend>
          {this.renderIdsListFilter('tag',     'Tags'      )}
          {this.renderIdsListFilter('contact', 'Contacts'  )}
          {this.renderIdsListFilter('project', 'Projets'   )}
          {this.renderIdsListFilter('event',   'Evènements')}
        </fieldset>

        {this.renderCustomFieldsFilters()}
      </div>
    )
  }

  renderStatusFilter() {
    return (
      <div className="form-group">
        <label htmlFor="organizations_status"
               className="col-sm-3 control-label">
          Statut
        </label>

        <div className="col-sm-9">
          <StatusSelect optionsPath={this.props.organizationStatusesOptionsPath}
                        value={this.props.filters.status}
                        updateValue={this.updateStatusFilter.bind(this)} />
        </div>
      </div>
    )
  }

}
