class PreviousNextNav extends React.Component {

  gotoNext() {
    if(this.props.currentItemId == this.props.items.length - 1) {
      if(this.props.infiniteEnabled) {
        this.props.loadNextBatchFromBackend(() => {
          this.pushNext(this.props.currentItemId)
        })
      }
    }
    else {
      this.pushNext(this.props.currentItemId)
    }
  }

  pushNext() {
    if(this.props.currentItemId + 1 < this.props.items.length) {
      this.props.router.push(`contacts/${this.props.items[this.props.currentItemId + 1].id}`)
    } else {
      this.props.router.push(`contacts/${this.props.items[0].id}`)
    }
  }

  hasNext() {
    return true
  }

  gotoPrevious() {
    if(this.props.currentItemId > 1) {
      this.props.router.push(`contacts/${this.props.items[this.props.currentItemId - 1].id}`)
    }
  }

  hasPrevious() {
    return this.props.currentItemIndex > 1
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
