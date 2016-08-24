class ItemsBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  removeItem(item) {
    if(confirm(this.props.removeConfirmMessage)) {
      var itemIds = this.props.contact[this.props.fieldName]

      var params = {
        _method: 'PUT',
        contact: {}
      };

      params.contact[this.props.fieldName] = _.filter(itemIds, (itemId) => {
        return itemId != item.id;
      });

      $.post(this.props.contactPath, humps.decamelizeKeys(params), () => {
        this.props.reloadFromBackend();
      });
    }
  }

  render() {
    return (
      <div className="items-block">
        <h3>{this.props.label} ({this.props.items.length})</h3>
        {this.renderItems()}
      </div>
    );
  }

  renderItems() {
    var itemDivs = _.map(this.props.items, (item) => {
      return this.renderItem(item);
    });

    return (
      <div className="row">
        {itemDivs}
      </div>
    )
  }

  renderItem(item) {
    return (
      <div className="col-md-6" key={item.id}>
        <img className="img-thumbnail" src={item.previewPictureUrl} />
        <h4>{item.name}</h4>

        <i className="fa fa-times remove-icon"
           onClick={this.removeItem.bind(this, item)}></i>

        {this.renderDates(item)}

        <span>
          <i className="fa fa-group"></i>
          {item.contactIds.length}
        </span>
      </div>
    )
  }

  renderDates(item) {
    return (
      <span>{item.startDate} &rarr; {item.endDate}</span>
    );
  }
}

module.exports = ItemsBlock
