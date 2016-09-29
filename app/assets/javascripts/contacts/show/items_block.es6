import Select from 'react-select'

class ItemsBlock extends React.Component {

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
      var itemIds = _.filter(this.props.contact[this.props.fieldName], (itemId) => {
        return itemId != item.id
      })

      this.saveOnBackend(itemIds)
    }
  }

  addItem(option) {
    this.saveOnBackend(
      _.uniq(_.concat(this.props.contact[this.props.fieldName], option.value))
    )
  }

  saveOnBackend(itemIds) {
    var params = {
      contact: {}
    }

    params.contact[this.props.fieldName] = itemIds.length ? itemIds : [''] // [''] is a way for the rails server to keep the empty array

    http.put(this.props.contactPath, params)
  }

  render() {
    return (
      <div className="associations-block items-block">
        <div className="row">
          <div className="col-md-12">
            <h3>{this.props.label} ({this.props.items.length})</h3>
          </div>
        </div>

        {this.renderItems()}
        {this.renderSelect()}
      </div>
    )
  }

  renderItems() {
    if(this.props.items.length) {
      var itemDivs = _.map(this.props.items, (item) => {
        return this.renderItem(item)
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

  renderItem(item) {
    return (
      <div className="col-md-6 association item" key={item.id}>
        <div className="association-inside">
          <img className="img-thumbnail" src={item.thumbPictureUrl} />
          <h4>
            <Link to={item.scopedPath}>{item.name}</Link>
          </h4>

          {this.renderRemoveIcon(item)}
          {this.renderDates(item)}

          <div className="members">
            <i className="fa fa-group"></i>
            {item.contactIds.length}
          </div>
        </div>
      </div>
    )
  }

  renderRemoveIcon(item) {
    if(this.props.canWrite) {
      return (
        <i className="fa fa-times remove-icon"
           onClick={this.removeItem.bind(this, item)}></i>
      )
    }
  }

  renderDates(item) {
    if(this.props.fieldName == 'projectIds') {
      return (
        <span className="dates">{item.startDate} &rarr; {item.endDate}</span>
      )
    }

    if(this.props.fieldName == 'eventIds') {
      return (
        <span className="dates">{item.happensOn}</span>
      )
    }
  }

  renderSelect() {
    if(this.props.canWrite) {
      var filteredOptions = _.reject(this.state.options, (option) => {
        return _.includes(this.props.contact[this.props.fieldName], option.value)
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

module.exports = ItemsBlock
