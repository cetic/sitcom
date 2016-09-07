class PreviousNextNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentItemIndex: -1
    }
  }

  componentDidMount() {
    this.setCurrentItemIndex()
  }

  componentDidUpdate(prevProps, prevState) {
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
    if(this.props.currentItemId > 1) {
      this.pushItemAtIndex(this.state.currentItemIndex - 1)
    }
    else {
      this.pushItemAtIndex(this.props.items.length)
    }
  }

  pushItemAtIndex(index) {
    var path = this.props.items[index].scopedPath + this.props.search
    this.props.router.push(path)
  }

  hasNext() {
    return true
  }

  hasPrevious() {
    return true
  }

  render() {
    if(this.hasPrevious()) {
      var previousLink = (
        <a href="javascript:;" onClick={this.gotoPrevious.bind(this)}>Précédent</a>
      )
    }

    if(this.hasNext()) {
      var nextLink = (
        <a href="javascript:;" onClick={this.gotoNext.bind(this)}>Suivant</a>
      )
    }

    return (
      <div>
        {previousLink}
        &nbsp;&nbsp;
        {this.renderFraction()}
        &nbsp;&nbsp;
        {nextLink}
      </div>
    )
  }

  renderFraction() {
    return (
      <span>{this.state.currentItemIndex + 1} / {this.props.items.length}</span>
    )
  }

}

module.exports = PreviousNextNav
