import Dropzone from 'dropzone'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    var uploadPercentageSelector = $('.upload-percentage')
    var uploadTextSelector       = $('.upload-text')

    uploadPercentageSelector.hide()
    uploadTextSelector.hide()

    $(this.refs.dropzone).dropzone({
      url:                   ".",
      paramName:             'picture',
      createImageThumbnails: false,
      clickable:             true,
      acceptedFiles:         "image/*",
      method:                'put',
      accept:                (file, done)      => { done() },
      success:               (file, message)   => { uploadPercentageSelector.hide(); this.props.reloadFromBackend() },
      error:                 (file, message)   => { console.log(message) },
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
      <div className="general">
        <Link to={'/contacts' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderActivity() }
        { this.renderEdit() }

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-8">
            <h1>{ this.props.contact.name }</h1>

            <div className="activity-text">
              { this.renderActivityText() }
            </div>

            <div className="organizations">
              { this.renderOrganizations() }
            </div>

            <ul className="fields">
              { this.renderFields() }
            </ul>
          </div>
        </div>

        <div className="row row-contact-infos">
          { this.renderAddress() }
          { this.renderPhone() }
          { this.renderEmail() }
        </div>
      </div>
    );
  }

  renderActivity() {
    var activityClass = 'activity'
    activityClass     += this.props.contact.active ? ' active' : ''

    return (
      <div className={activityClass}>
        <div className="activity-inside">&nbsp;
        </div>
      </div>
    )
  }

  renderEdit() {
    return(
      <button className="btn btn-secondary btn-edit"
              onClick={this.props.toggleEditMode}>
        Modifier
      </button>
    )
  }

  renderPicture() {
    return (
      <div className="picture" ref="dropzone">
        <img className="img-thumbnail" src={this.props.contact.pictureUrl} />
        <div className="upload-text">
          Déposez l'image ici.
        </div>

        <div className="upload-percentage">
          Upload en cours: 0%
        </div>
      </div>
    )
  }

  renderActivityText() {
    // if(this.props.contact.active)
    //   return "actif"
    // else
    //   return "inactif"
  }

  renderOrganizations() {
    return _.map(this.props.contact.organizations, (organization) => {
      return (
        <Link to={'/organizations/' + organization.id} key={organization.id}>
          {organization.name}
        </Link>
      )
    })
  }

  renderFields() {
    return _.map(this.props.contact.fields, (field) => {
      return (
        <li className="field" key={ field.id }>
          <span className="label label-default">{ field.name }</span>
        </li>
      )
    })
  }

  renderAddress() {
    var address = () => {
      if(this.props.contact.address == '')
        return <em>non-renseignée</em>;
      else
        return (
          <div className="address">
            { this.props.contact.addressStreet }
            <br/>
            { this.props.contact.addressZipCode } { this.props.contact.addressCity }
            <br/>
            { this.props.contact.addressCountry }
          </div>
        )
    }

    return (
      <div className="col-md-4">
        <h3>Adresse</h3>

        { address() }
      </div>
    )
  }

  renderPhone() {
    var phone = () => {
      if(this.props.contact.phone == '')
        return <em>non-renseigné</em>;
      else
        return (
          <span title={this.props.contact.phone}>
            {this.props.contact.phone}
          </span>
        )
    }

    return (
      <div className="col-md-4">
        <h3>Téléphone</h3>

        { phone() }
      </div>
    )
  }

  renderEmail() {
    var email = () => {
      if(this.props.contact.email == '')
        return <em>non-renseigné</em>;
      else
        return (
          <a title={this.props.contact.email}
             href={ "mailto:" + this.props.contact.email }
             target="_blank">
            {this.props.contact.email}
          </a>
        )
    }

    return (
      <div className="col-md-4">
        <h3>Email</h3>

        { email() }
      </div>
    )
  }
}

module.exports = GeneralShow
