import Dropzone from 'dropzone'

class CustomDropzone extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    var uploadPercentageSelector = $(this.refs.uploadPercentage)
    var uploadTextSelector       = $(this.refs.uploadText)

    uploadPercentageSelector.hide()
    uploadTextSelector.hide()

    $(this.refs.dropzone).dropzone({
      url:                   this.props.url,
      paramName:             'picture',
      createImageThumbnails: false,
      clickable:             true,
      acceptedFiles:         this.props.acceptedFiles,
      method:                'put',
      accept:                (file, done)      => { done() },
      success:               (file, message)   => { uploadPercentageSelector.hide(); this.props.afterSuccess() },
      error:                 (file, message)   => { alert(message); uploadTextSelector.hide(); uploadPercentageSelector.hide(); },
      uploadprogress:        (file, progress)  => { uploadPercentageSelector.text("Upload: " + progress.toFixed(0) + '%') },
      drop:                  (event)           => { uploadTextSelector.hide(); uploadPercentageSelector.show(); },
      addedfile:             (event)           => { uploadPercentageSelector.show() },
      dragover:              (event)           => { uploadTextSelector.show() },
      dragleave:             (event)           => { uploadTextSelector.hide() },
      previewTemplate:       '<div id="preview-template" style="display: none;"></div>',
      headers: {
        "X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')
      }
    });
  }

  render() {
    return (
      <div ref="dropzone">
        { this.props.children }

        <div className="upload-text" ref="uploadText">
          Déposez l'image ici.
        </div>

        <div className="upload-percentage" ref="uploadPercentage">
          Upload en cours: 0%
        </div>
      </div>
    )
  }
}

module.exports = CustomDropzone
