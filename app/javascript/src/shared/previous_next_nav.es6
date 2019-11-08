class PreviousNextNav extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      currentItemIndex: -1
    }
  }

  componentDidMount() {
    this.setCurrentItemIndex()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentItemId != this.props.currentItemId) {
      this.setCurrentItemIndex()
    }
  }

  setCurrentItemIndex() {
    var index = _.findIndex(this.props.items, (item) => {
      return item.id == parseInt(this.props.currentItemId)
    })

    this.setState({
      currentItemIndex: index
    })
  }

  gotoNext() {
    if(this.state.currentItemIndex == this.props.items.length - 1) {
      this.pushItemAtIndex(0)
    }
    else {
      this.pushItemAtIndex(this.state.currentItemIndex + 1)
    }
  }

  gotoPrevious() {
    if(this.state.currentItemIndex > 0) {
      this.pushItemAtIndex(this.state.currentItemIndex - 1)
    }
    else {
      this.pushItemAtIndex(this.props.items.length - 1)
    }
  }

  pushItemAtIndex(index) {
    var path = this.props.items[index].scopedPath + this.props.search
    this.props.router.push(path)
  }

  render() {
    var previousLink = (
      <a href="javascript:;" onClick={this.gotoPrevious.bind(this)}>
        <i className="fa fa-caret-up"></i>
      </a>
    )

    var nextLink = (
      <a href="javascript:;" onClick={this.gotoNext.bind(this)}>
        <i className="fa fa-caret-down"></i>
      </a>
    )

    return (
      <div className="previous-next">
        {previousLink}
        <br/>
        {this.renderFraction()}
        <br/>
        {nextLink}
      </div>
    )
  }

  renderFraction() {
    return (
      <span>
        {this.state.currentItemIndex + 1}
        <hr/>
        {this.props.items.length}
      </span>
    )
  }

}

module.exports = PreviousNextNav
