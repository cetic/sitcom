import TextCustomField from './custom_fields_block/text_custom_field.es6'
import BoolCustomField from './custom_fields_block/bool_custom_field.es6'
import EnumCustomField from './custom_fields_block/enum_custom_field.es6'

class CustomFieldsBlock extends React.Component {

  render() {
    if(this.props.item.customFields.length) {
      return (
        <div className="custom-fields-block">
          <div className="row">
            <div className="col-md-12">
              <h3>Champs personnalisés</h3>
            </div>
          </div>

          <div className="row">
            { this.renderCustomFields() }
          </div>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  renderCustomFields() {
    return _.map(this.props.item.customFields, (customField) => {
      return (
        <div className="col-md-6" key={customField.id}>
          { this.renderCustomField(customField) }
        </div>
      )
    })
  }

  renderCustomField(customField) {
    if(customField.fieldType == 'text') {
      return (
        <TextCustomField key={customField.id}
                         item={this.props.item}
                         customField={customField}
                         canWrite={this.props.canWrite} />
      )
    }
    else if(customField.fieldType == 'bool') {
      return (
        <BoolCustomField key={customField.id}
                         item={this.props.item}
                         customField={customField}
                         canWrite={this.props.canWrite} />
      )
    }
    else if(customField.fieldType == 'enum') {
      return (
        <EnumCustomField key={customField.id}
                         item={this.props.item}
                         customField={customField}
                         canWrite={this.props.canWrite} />
      )
    }
  }

}

module.exports = CustomFieldsBlock
