import Select from 'react-select'

class SavedSearches extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      savedSearches: [],
      loaded:        false,
      selectedId:    undefined
    }
  }

  componentDidMount() {
    this.reloadFromBackend()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.search != this.props.search) {
      if(this.hasSelected() && newProps.search != this.selectedSavedSearch().search) {
        this.setState({
          selectedId: undefined
        })
      }
    }
  }

  reloadFromBackend(callback) {
    this.setState({ loaded: false })

    http.get(this.props.savedSearchesPath, {}, (data) => {
      this.setState({
        savedSearches: data,
        loaded:        true
      }, callback)
    })
  }

  hasSelected() {
    return this.state.selectedId != undefined
  }

  selectedSavedSearch() {
    return _.find(this.state.savedSearches, (savedSearch) => {
      return savedSearch.id == this.state.selectedId
    })
  }

  updateSelectedId(option) {
    var value = option ? parseInt(option.value) : undefined

    this.setState({ selectedId: value }, () => {
      if(this.hasSelected()) {
        this.applySelected()
      }
    })
  }

  applySelected() {
    const savedSearch = this.selectedSavedSearch()

    if(savedSearch.search != undefined) {
      this.props.router.push(`${this.props.itemType}s` + savedSearch.search)
    }
  }

  create() {
    const name = prompt("Nom de la recherche")

    if(_.trim(name).length) {
      var params = {
        savedSearch: {
          name:   name,
          search: this.props.search
        }
      }

      http.post(this.props.savedSearchesPath, params, (data) => {
        if(data.success) {
          this.reloadFromBackend(() => {
            this.setState({
              selectedId: data.savedSearch.id
            })
          })
        }
      })
    }
  }

  destroySelected() {
    if(confirm("Supprimer la recherche sauvée ?")) {
      const path = `${this.props.savedSearchesPath}/${this.state.selectedId}`

      http.delete(path, {}, (data) => {
        if(data.success) {
          this.setState({ selectedId: undefined }, () => {
            this.reloadFromBackend()
          })
        }
      })
    }
  }

  render() {
    return (
      <div>
        <h4>Recherches sauvées</h4>
        {this.renderSelect()}
        {this.renderCreateButton()}
        {this.renderDestroyButton()}
      </div>
    )
  }

  renderSelect() {
    if(this.state.loaded) {
      var options = _.map(this.state.savedSearches, (savedSearch) => {
        return {
          value: savedSearch.id,
          label: savedSearch.name
        }
      })

      if(this.hasSelected()) {
        var value = _.find(options, (option) => {
          return option.value == this.state.selectedId
        })
      }

      return (
        <Select multi={false}
                options={options}
                value={value}
                placeholder="Recherches sauvées"
                onChange={this.updateSelectedId.bind(this)} />
      )
    }
  }

  renderCreateButton() {
    if(!this.hasSelected()) {
      return (
        <a href="javascript:;"
           className="btn btn-default btn-primary btn-success"
           onClick={this.create.bind(this)}>Enregistrer</a>
      )
    }
  }

  renderDestroyButton() {
    if(this.hasSelected()) {
      return (
        <a href="javascript:;"
           className="btn btn-default btn-danger"
           onClick={this.destroySelected.bind(this)}>Supprimer</a>
      )
    }
  }

}

module.exports = SavedSearches
