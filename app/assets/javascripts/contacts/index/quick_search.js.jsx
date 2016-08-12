class QuickSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  updateQuickSearch(e) {
    this.props.updateQuickSearch(e.target.value);
  }

  render() {
    return (
      <div className="quick-search">
        <input type="search"
               className="form-control"
               placeholder="Filter on text, people or tag"
               value={this.props.quickSearch}
               onChange={this.updateQuickSearch.bind(this)} />
        <i className="glyphicon glyphicon-search"></i>
        <i className="fa fa-times"></i>
      </div>

    )
  }
}

module.exports = QuickSearch
