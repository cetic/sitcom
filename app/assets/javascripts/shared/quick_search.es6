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
        {this.renderResetIcon()}
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
}

module.exports = QuickSearch
