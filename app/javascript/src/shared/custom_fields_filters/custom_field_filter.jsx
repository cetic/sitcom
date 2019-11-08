export default class CustomFieldFilter extends React.Component {

  getValue() {
    return this.props.filters[`customField${this.props.customField.id}`]
  }

  render() {
    return (
      <div className="custom-field-filter form-group">
        <label className="col-sm-3 control-label">
          {this.props.customField.name}
        </label>

        <div className="col-sm-9 custom-field-filter-value">
          {this.renderInput()}
        </div>
      </div>
    )
  }

}
