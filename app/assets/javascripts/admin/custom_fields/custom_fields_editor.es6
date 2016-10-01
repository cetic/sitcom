class CustomFieldsEditor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      options:   this.props.options,
      newOption: ''
    }
  }

  addOption(e) {
    const newOption = _.trim(this.state.newOption)

    if(!_.includes(this.state.options, newOption)) {
      this.setState({
        options:   this.state.options.concat(newOption),
        newOption: ''
      })
    }

    e.preventDefault()
  }

  removeOption(option) {
    this.setState({
      options: _.filter(this.state.options, (o) => {
        return o != option
      })
    })
  }

  updateNewOption(e) {
    this.setState({
      newOption: e.target.value
    })
  }

  render() {
    return (
      <fieldset id="enum-options">
        <legend>Valeurs possibles</legend>

        <table className="table table-striped">
          {this.renderBody()}
          {this.renderFooter()}
        </table>
      </fieldset>
    )
  }

  renderBody() {
    if(this.state.options.length) {
      return (
        <tbody>
          {this.renderOptions()}
        </tbody>
      )
    }
  }

  renderOptions() {
    return _.map(this.state.options, (option) => {
      return this.renderOption(option)
    })
  }

  renderOption(option) {
    return (
      <tr key={option}>
        <td>
          {option}
          <input type="hidden" name="custom_field[options][]" value={option} />
        </td>

        <td className="actions">
          <button className="btn btn-xs btn-danger"
                  onClick={this.removeOption.bind(this, option)}>
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    )
  }

  renderFooter() {
    return (
      <tfoot>
        <tr>
          <td>
            <input type="text"
                   className="form-control"
                   value={this.state.newOption}
                   onChange={this.updateNewOption.bind(this)} />
          </td>

          <td className="actions">
            <button className="btn btn-primary"
                    onClick={this.addOption.bind(this)}>
              Ajouter
            </button>
          </td>
        </tr>
      </tfoot>
    )
  }

}

module.exports = CustomFieldsEditor
