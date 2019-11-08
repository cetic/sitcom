import Dropzone from 'dropzone'

class CustomDropzone extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    var uploadPercentageSelector = $(this.refs.uploadPercentage)
    var uploadTextSelector       = $(this.refs.uploadText)

    uploadPercentageSelector.hide()
    uploadTextSelector.hide()

    $(this.refs.dropzone).dropzone({
      url:                   this.props.url,
      paramName:             this.props.paramName || 'picture',
      createImageThumbnails: false,
      clickable:             this.props.clickable,
      acceptedFiles:         this.props.acceptedFiles,
      method:                this.props.method || 'put',
      accept:                (file, done)      => { done() },
      success:               (file, message)   => { uploadPercentageSelector.hide(); this.props.afterSuccess ? this.props.afterSuccess() : '' },
      error:                 (file, message)   => { alert(message); uploadTextSelector.hide(); uploadPercentageSelector.hide() },
      uploadprogress:        (file, progress)  => { uploadPercentageSelector.text("Upload en cours : " + progress.toFixed(0) + '%') },
      drop:                  (event)           => { uploadTextSelector.hide(); uploadPercentageSelector.show() },
      addedfile:             (event)           => { uploadPercentageSelector.show() },
      dragover:              (event)           => { uploadTextSelector.show() },
      previewTemplate:       '<div id="preview-template" style="display: none;"></div>',
      headers: {
        "X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')
      }
    })
  }

  render() {
    return (
      <div ref="dropzone" className="custom-dropzone">
        { this.props.children }

        <div className="update-image">
          { this.props.uploadText || 'Modifier la photo' }
        </div>

        <div className="upload-text" ref="uploadText">
          Déposez l'image ici.
        </div>

        <div className="upload-percentage" ref="uploadPercentage">
          Upload en cours : 0%
        </div>
      </div>
    )
  }
}

module.exports = CustomDropzone
