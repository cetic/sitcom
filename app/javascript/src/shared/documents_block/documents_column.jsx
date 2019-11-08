import Document       from './document.jsx'
import CustomDropzone from '../../shared/custom_dropzone.jsx'

export default class DocumentsColumn extends React.Component {

  render() {
    var className = `documents-column-${this.props.privacy}`

    return (
      <div className={className}>
        <h3>{this.props.label} ({this.props.documents.length})</h3>

        {this.renderDocuments()}
        {this.renderNewDocument()}
      </div>
    )
  }

  renderDocuments() {
    return _.map(this.props.documents, (document) => {
      return (
        <Document key={document.id}
                  document={document}
                  canWrite={this.props.canWrite} />
      )
    })
  }

  renderNewDocument() {
    if(this.props.canWrite) {
      var clickable = [`.documents-column-${this.props.privacy} .update-image`]

      return (
        <div className="new-document">
          <CustomDropzone url={this.props.item.path + `/documents?privacy=${this.props.privacy}`}
                          method="post"
                          paramName="file"
                          uploadText="Ajouter un document"
                          clickable={clickable}
                          acceptedFiles={null}>
          </CustomDropzone>
        </div>
      )
    }
  }

}
