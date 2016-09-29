import CustomField from './custom_fields_block/custom_field.es6'

class CustomFieldsBlock extends React.Component {

  render() {
    return (
      <div className="associations-block organizations-block">
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
    return (
      <CustomField key={customField.id}
                   customField={customField} />
    )
  }

}

module.exports = CustomFieldsBlock
