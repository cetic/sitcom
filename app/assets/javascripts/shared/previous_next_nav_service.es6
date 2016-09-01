class PreviousNextNavService {

  static getCurrentIndex(items, currentItemId) {
    return _.findIndex(items, (item) => {
      return item.id == parseInt(currentItemId);
    });
  }

  static gotoNext(items, currentItemId, router) {
    var index = this.getCurrentIndex(items, currentItemId)

    var pushNext = () => {
      if(index + 1 < items.length) {
        router.push(`contacts/${items[index + 1].id}`)
      } else {
        router.push(`contacts/${items[0].id}`)
      }
    }

    if(index == items.length - 1) {
      if(this.state.infiniteEnabled) {
        this.loadNextBatchFromBackend(() => {
          pushNext()
        })
      }
    }
    else {
      pushNext()
    }
  }

  static gotoPrevious(items, currentItemId, router) {
    var index = this.getCurrentIndex(items, currentItemId)

    if(index > 1) {
      router.push(`contacts/${items[index - 1].id}`)
    }
  }

  static hasPrevious(items, currentItemId) {
    return this.getCurrentIndex(items, currentItemId) > 1
  }

}

export default PreviousNextNavService
