import ParamsService from '../params_service.es6'

class BaseMain extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.dReloadFromBackend = _.debounce(this.reloadFromBackend, 300)
  }

  componentDidMount() {
    this.reloadFromBackend()
    this.selectHeaderMenu()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.location.search != this.props.location.search) {
      this.dReloadFromBackend()
    }
  }

  selectHeaderMenu() {
    $('.nav.sections li').removeClass('selected')
    $(`.nav.sections li.${this.itemType}s`).addClass('selected')
  }

  openNewModal() {
    $(`.new-${this.itemType}-modal`).modal('show')
  }

  reloadFromBackend(spinner = true) {
    const itemsPath = this.props[`${this.itemType}sPath`]

    if(spinner) {
      this.setState({ loaded: false })
    }

    http.get(itemsPath, this.getFilters(), (data) => {
      var newState = {
        loaded:        true,
        selectedCount: 0
      }

      newState[`${this.itemType}s`] = data[`${this.itemType}s`]
      this.setState(newState)
    })
  }

  updateUrl(newValues) {
    var query        = _.assign({}, this.props.location.query, newValues)
    var paramsString = ParamsService.rejectEmptyParams($.param(query))
    this.props.router.push(`${this.itemType}s?${paramsString}`)
  }

  updateQuickSearch(newQuickSearch) {
    this.updateFilters({
      quickSearch: newQuickSearch
    })
  }

  updateFilters(newFilters) {
    this.updateUrl(newFilters)
  }

  renderNewButton(label) {
    if(this.props.permissions[`canWrite${_.upperFirst(this.itemType)}s`]) {
      return (
        <button className="btn btn-primary new"
                onClick={this.openNewModal.bind(this)}>
          {label}
        </button>
      )
    }
  }

}

module.exports = BaseMain
