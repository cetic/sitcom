import Select from 'react-select'

export default class ItemsSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
      loaded:  false,
      itemIds: this.props.itemIds || ''
    }
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.itemIds != this.props.itemIds) {
      this.reloadOptionsFromBackend(() => {
        this.setState({
          itemIds: newProps.itemIds || ''
        })
      })
    }
  }

  reloadOptionsFromBackend(callback) {
    this.setState({ loaded: false })

    http.get(this.props.optionsPath, {
      itemType: this.props.itemType
    }, (data) => {
      this.setState({
        options: data,
        loaded:  true
      }, callback)
    })
  }

  updateValue(options) {
    var value = _.map(options, (option) => {
      return option.value
    }).join(',')

    this.setState({ itemIds: value }, () => {
      this.props.updateValue(value)
    })
  }

  getValue() {
    var value = []
    var ids   = this.state.itemIds.split(',')

    if(ids.length && ids[0] != '') {
      value = _.map(ids, (id) => {
        var option = _.find(this.state.options, (option) => {
          return option.value == parseInt(id)
        })

        return {
          label: option.label,
          value: id
        }
      })
    }

    return value
  }

  render() {
    if(this.state.loaded) {
      return (
        <div>
          { this.renderLabel() }
          { this.renderSelect() }
        </div>
      )
    }
    else {
      return null
    }
  }

  renderLabel() {
    if(this.props.label) {
      return (<label>{this.props.label}</label>)
    }
  }

  renderSelect() {
    var filteredOptions = _.reject(this.state.options, (option) => {
      return _.includes(this.state.itemIds, option.value)
    })

    return (
      <Select multi={true}
              value={this.getValue()}
              options={filteredOptions}
              onChange={this.updateValue.bind(this)}
              optionRenderer={this.renderOption.bind(this)} />
    )
  }

  renderOption(option) {
    if(option.highlight) {
      return ( <div><strong>{option.label}</strong></div> )
    }
    else if (option.color) {
      return ( <div><span className="label label-default" style={{ backgroundColor: option.color }}>{option.label}</span></div> )
    }
    else {
      return ( <div>&nbsp;&nbsp;&nbsp;{option.label}</div> )
    }
  }
}
