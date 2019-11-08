import TextCustomFieldFilter from './custom_fields_filters/text_custom_field_filter.jsx'
import BoolCustomFieldFilter from './custom_fields_filters/bool_custom_field_filter.jsx'
import EnumCustomFieldFilter from './custom_fields_filters/enum_custom_field_filter.jsx'

export default class CustomFieldsFilters extends React.Component {

  render() {
    var customFieldsFilters = _.map(this.props.customFields, (customField) => {
      return this.renderCustomFieldFilter(customField)
    })

    return(
      <fieldset>
        <legend>Champs personnalisés</legend>
        {customFieldsFilters}
      </fieldset>
    )
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
