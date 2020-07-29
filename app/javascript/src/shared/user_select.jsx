import Select from 'react-select'

export default class UserSelect extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      options: []
    }
  }

  componentDidMount() {
    http.get('../users/options.json', {}, (data) => {
      this.setState({
        loaded:  true,
        options: data
      })
    })
  }

  onChange(option) {
    this.props.onChange(option)
  }

  render() {
    if(this.state.loaded) {
      const valueOption = _.find(this.state.options, {
        value: this.props.value
      })

      return (
        <Select
          multi={false}
          value={valueOption}
          options={this.state.options}
          onChange={this.onChange.bind(this)}
          placeholder={this.props.placeholder}
        />
      )
    }
    else return null
  }

}
