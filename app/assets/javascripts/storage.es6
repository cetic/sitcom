import EventEmitter from 'wolfy87-eventemitter'

class Storage {
  constructor(props) {
    this.route    = props.route
    this.ee       = new EventEmitter()

    this.bindCable('contact')
    this.bindCable('organization')
    this.bindCable('project')
    this.bindCable('event')
  }

  bindCable(itemType) {
    App.cable.subscriptions.create({ channel: `${_.upperFirst(itemType)}sChannel`, lab_id: this.route.labId }, {
      received: (data) => {
        var camelData = humps.camelizeKeys(data)
        var itemId    = camelData.action == 'destroy' ? camelData.itemId : camelData.item.id

        if(camelData.action == 'create')
          this.onCableCreate(camelData, itemType, itemId)
        else if(camelData.action == 'update')
          this.onCableUpdate(camelData, itemType, itemId)
        else if(camelData.action == 'destroy')
          this.onCableDestroy(camelData, itemType, itemId)
      }
    })
  }

  onCableCreate(data, itemType, itemId) {
    this.ee.emitEvent(`${itemType}-created`) // signal component that state need to be reloaded from backend
  }

  onCableUpdate(data, itemType, itemId) {
    var items    = this[`${itemType}s`]
    var index    = _.findIndex(items, (item) => { return itemId == item.id })

    if(index != -1) {
      items[index] = data.item

      this.ee.emitEvent(`${itemType}-updated`) // signal component that state need to be updated from storage
    }
  }

  onCableDestroy(data, itemType, itemId) {
    var items            = this[`${itemType}s`]
    this[`${itemType}s`] = _.filter(items, (item) => { return itemId != item.id })

    this.ee.emitEvent(`${itemType}-destroyed`) // signal component that state need to be updated from storage
  }

  getItem(name) {
    return this[name]
  }

  setItem(name, newItem) {
    this[name] = newItem
  }
}

module.exports = Storage
