class QuickSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="quick-search">
        <input type="search"
               className="form-control"
               placeholder="Filter on text, people or tag" />
        <i className="glyphicon glyphicon-search"></i>
        <i className="fa fa-times"></i>
      </div>

    )
  }
}

module.exports = QuickSearch
