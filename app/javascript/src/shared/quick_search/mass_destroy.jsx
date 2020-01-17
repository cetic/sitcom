class MassDestroy extends React.Component {

  destroy() {
    const msg = `Etes-vous sûr de vouloir supprimer les ${this.props.singularItemName + 's'} sélectionnés ?`

    if(confirm(msg)) {
      const url = `${this.props.itemType}s/mass_destroy`

      const params = {
        _method: 'DELETE',
        ids:     this.props.selectedItemIds
      }

      $.post(url, params, (data) => {
        this.props.unselectAllItems()
      })
    }
  }

  render() {
    return (
      <div className="destroy-selection">
        <i className="fa fa-trash"
           title={`Supprimer les ${this.props.singularItemName + 's'} sélectionnés`}
           onClick={this.destroy.bind(this)}>
        </i>
      </div>
    )
  }

}

export default MassDestroy
