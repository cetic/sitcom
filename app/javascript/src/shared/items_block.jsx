import Select from 'react-select'

import Item from './items_block/item.jsx'

export default class ItemsBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      options: []
    }
  }

  componentDidMount() {
    this.reloadOptionsFromBackend()
  }

  reloadOptionsFromBackend() {
    http.get(this.props.optionsPath, {}, (data) => {
      this.setState({
        options: data
      })
    })
  }

  removeItem(item) {
    if(confirm(this.props.removeConfirmMessage)) {
      var itemIds = _.filter(this.props.parent[this.props.fieldName], (itemId) => {
        return itemId != item.id
      })

      this.saveOnBackend(itemIds)
    }
  }

  addItem(option) {
    this.saveOnBackend(
      _.uniq(_.concat(this.props.parent[this.props.fieldName], option.value))
    )
  }

  saveOnBackend(itemIds) {
    var params = {
      [`${this.props.backendParentParam}`]: {
        [`${this.props.fieldName}`]: itemIds.length ? itemIds : [''] // [''] is a way for the rails server to keep the empty array
      }
    }

    http.put(this.props.parentPath, params)
  }

  render() {
    // ex: use projectIds to create projects by removing 'Id'
    const classes = `associations-block items-block ${this.props.fieldName.replace('Id', '')}-block`

    return (
      <div className={classes}>
        <div className="row">
          <div className="col-md-12">
            <h3>{this.props.label} ({this.props.itemLinks.length})</h3>
          </div>
        </div>

        {this.renderItems()}
        {this.renderSelect()}
      </div>
    )
  }

  renderItems() {
    if(this.props.itemLinks.length) {
      var itemDivs = _.map(this.props.itemLinks, (itemLink) => {
        return this.renderItem(itemLink)
      })

      return (
        <div className="row">
          {itemDivs}
        </div>
      )
    }
    else {
      return (
        <div className="row">
          <div className="col-md-12">
            {this.props.emptyMessage}
          </div>
        </div>
      )
    }
  }

  renderItem(itemLink) {
    return (
      <Item key={itemLink.id}
            itemLink={itemLink}
            itemType={this.props.itemType}
            canWrite={this.props.canWrite}
            removeItem={this.removeItem.bind(this)}
            linkName={this.props.linkName} />
    )
  }

  renderSelect() {
    if(this.props.canWrite) {
      var filteredOptions = _.reject(this.state.options, (option) => {
        return _.includes(this.props.parent[this.props.fieldName], option.value)
      })

      return (
        <div className="select">
          <Select multi={false}
                  options={filteredOptions}
                  placeholder="Ajouter..."
                  onChange={this.addItem.bind(this)} />
        </div>
      )
    }
  }

}
