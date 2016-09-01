class PreviousNextNav extends React.Component {

  getCurrentIndex() {
    return _.findIndex(this.props.items, (item) => {
      return item.id == parseInt(this.props.currentItemId);
    });
  }

  gotoNext() {
    var index = this.getCurrentIndex()

    if(index == this.props.items.length - 1) {
      if(this.props.infiniteEnabled) {
        this.props.loadNextBatchFromBackend(() => {
          this.pushNext(index)
        })
      }
    }
    else {
      this.pushNext(index)
    }
  }

  pushNext(index) {
    if(index + 1 < this.props.items.length) {
      this.props.router.push(`contacts/${this.props.items[index + 1].id}`)
    } else {
      this.props.router.push(`contacts/${this.props.items[0].id}`)
    }
  }

  hasNext() {
    return true
  }

  gotoPrevious() {
    var index = this.getCurrentIndex()

    if(index > 1) {
      this.props.router.push(`contacts/${this.props.items[index - 1].id}`)
    }
  }

  hasPrevious() {
    return this.getCurrentIndex(this.props.items, this.props.currentItemId) > 1
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
        {nextLink}
      </div>
    )
  }

}

export default PreviousNextNav
