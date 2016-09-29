import TextCustomField from './custom_fields_block/text_custom_field.es6'
import BoolCustomField from './custom_fields_block/bool_custom_field.es6'
import EnumCustomField from './custom_fields_block/enum_custom_field.es6'

class CustomFieldsBlock extends React.Component {

  render() {
    return (
      <div className="associations-block custom-fields-block">
        <div className="row">
          <div className="col-md-12">
            <h3>Champs personnalisés</h3>

            {this.renderCustomFields()}
          </div>
        </div>
      </div>
    )
  }

  renderCustomFields() {
    return _.map(this.props.item.customFields, (customField) => {
      return this.renderCustomField(customField)
    })
  }

  renderCustomField(customField) {
    if(customField.fieldType == 'text') {
      return (
        <TextCustomField key={customField.id}
                         item={this.props.item}
                         customField={customField} />
      )
    }
    else if(customField.fieldType == 'bool') {
      return (
        <BoolCustomField key={customField.id}
                         item={this.props.item}
                         customField={customField} />
      )
    }
    else if(customField.fieldType == 'enum') {
      return (
        <EnumCustomField key={customField.id}
                         item={this.props.item}
                         customField={customField} />
      )
    }
  }

}

module.exports = CustomFieldsBlock
