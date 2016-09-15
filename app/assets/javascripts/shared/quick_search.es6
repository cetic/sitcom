import ExportButton from '../shared/export_button.es6'

class QuickSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.quickSearch || ''
    };
  }

  componentDidMount() {
    $(this.refs.search).focus()
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ search: nextProps.quickSearch || '' })
  // }

  updateQuickSearch(e) {
    var search = e.target.value

    this.setState({ search: search }, () => {
      this.props.updateQuickSearch(search);
    })
  }

  resetQuickSearch() {
    this.setState({ search: '' }, () => {
      this.props.updateQuickSearch('');
    })
  }

  singularItemName() {
    var singularItemName = this.props.title.substring(0, this.props.title.length - 1);
    return singularItemName.toLowerCase()
  }

  render() {
    return (
      <div className="quick-search row">
        <span className="title">
          { this.props.title }
        </span>

        <input ref="search"
               type="search"
               className="form-control"
               placeholder="Recherche rapide"
               value={this.state.search}
               onChange={this.updateQuickSearch.bind(this)} />
        <i className="glyphicon glyphicon-search"></i>
        { this.renderResetIcon() }
        { this.renderResults() }
        { this.renderExportButton() }
      </div>
    )
  }

  renderResetIcon() {
    if(this.state.search.length) {
      return (
        <i className="fa fa-times" onClick={this.resetQuickSearch.bind(this)}></i>
      );
    }
  }

  renderExportButton() {
    if(this.props.results != 0 && this.props.loaded) {
      return (
        <ExportButton filterParams={this.props.filterParams}
                      exportUrl={this.props.exportUrl} />
      )
    }
  }

  renderResults() {
    if(this.props.results != 0 && this.props.loaded) {
      if(this.state.search == '') {
        return (
          <span className="results">
            { this.props.results == 1 ? this.props.results + ' ' + this.singularItemName() : this.props.results + ' ' + this.singularItemName() + 's' }
          </span>
        )
      }
      else {
        return (
          <span className="results">
            { this.props.results == 1 ? this.props.results + ' résultat trouvé' : this.props.results + ' résultats trouvés' }
          </span>
        )
      }
    }
  }
}

module.exports = QuickSearch
