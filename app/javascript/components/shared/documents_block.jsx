import DocumentsColumn from './documents_block/documents_column.jsx'

export default class DocumentsBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      privateDocuments: []
    }
  }

  componentDidMount() {
    this.reloadPrivateDocumentsFromBackend()
  }

  componentWillReceiveProps(newProps) {
    if(newProps.item.updatedAt != this.props.item.updatedAt) {
      this.reloadPrivateDocumentsFromBackend()
    }
  }

  reloadPrivateDocumentsFromBackend() {
    http.get(`${this.props.item.path}/documents`, { privacy: 'private' }, (data) => {
      this.setState({
        privateDocuments: data
      })
    })
  }

  render() {
    return (
      <div className="documents-block">
        <div className="row">
          <div className="col-md-6">
            {this.renderPublicColumn()}
          </div>

          <div className="col-md-6">
            {this.renderPrivateColumn()}
          </div>
        </div>
      </div>
    )
  }

  renderPublicColumn() {
    return (
      <DocumentsColumn label="Documents publics"
                       item={this.props.item}
                       documents={this.props.item.documents}
                       privacy="public"
                       canWrite={this.props.canWrite} />
    )
  }

  renderPrivateColumn() {
    return (
      <DocumentsColumn label="Documents privés"
                       item={this.props.item}
                       documents={this.state.privateDocuments}
                       privacy="private"
                       canWrite={true} />
    )
  }

}
