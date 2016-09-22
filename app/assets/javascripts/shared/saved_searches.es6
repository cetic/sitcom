import Select         from 'react-select'
import NewSavedSearch from './saved_searches/new_saved_search.es6'

class SavedSearches extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      savedSearches: [],
      loaded:        false,
      selectedId:    undefined,
      formMode:      false
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
      else {
        this.resetFilters()
      }
    })
  }

  setSelectedId(id) {
    this.setState({ selectedId: id }, () => {
      if(this.hasSelected()) {
        this.applySelected()
      }
    })
  }

  applySelected() {
    const savedSearch = this.selectedSavedSearch()

    if(savedSearch.search != undefined) {
      this.props.router.push(`${this.props.itemType}s${savedSearch.search}`)
    }
  }

  resetFilters() {
    this.props.router.push(`${this.props.itemType}s`)
  }

  setFormMode() {
    this.setState({
      formMode: true
    })
  }

  unsetFormMode() {
    this.setState({
      formMode: false
    })
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
        {this.renderFormMode()}
        {this.renderListMode()}
      </div>
    )
  }

  renderFormMode() {
    if(this.state.formMode) {
      return (
        <NewSavedSearch search={this.props.search}
                        savedSearchesPath={this.props.savedSearchesPath}
                        reloadFromBackend={this.reloadFromBackend.bind(this)}
                        savedSearchesPath={this.props.savedSearchesPath}
                        unsetFormMode={this.unsetFormMode.bind(this)}
                        setSelectedId={this.setSelectedId.bind(this)} />
      )
    }
  }

  renderListMode() {
    if(!this.state.formMode) {
      return (
        <div>
          {this.renderSelect()}
          {this.renderCreateButton()}
          {this.renderDestroyButton()}
        </div>
      )
    }
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
           onClick={this.setFormMode.bind(this)}>Enregistrer</a>
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
