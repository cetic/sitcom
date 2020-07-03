export default class SocialShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="social show">
        <div className="row">
          <div className="col-md-12">
            { this.renderFacebook() }
            { this.renderLinkedin() }
            { this.renderTwitter() }
          </div>

          { this.renderEdit() }
        </div>
      </div>
    )
  }

  renderEdit() {
    if(this.props.permissions.canWriteOrganizations) {
      return(
        <button className="btn btn-primary btn-edit"
                onClick={this.props.toggleEditMode}>
          Modifier
        </button>
      )
    }
  }

  renderSocialInside(url) {
    if(url == '') {
      return <em>non-renseigné</em>
    }
    else {
      let strippedUrl = url
      strippedUrl = _.replace(strippedUrl, 'https://', '')
      strippedUrl = _.replace(strippedUrl, 'http://', '')

      return (
        <a href={ url } target="_blank">
          { strippedUrl }
        </a>
      )
    }
  }

  renderFacebook() {
    return (
      <div className="facebook">
        <i className="fa fa-facebook-square"></i>
        { this.renderSocialInside(this.props.organization.facebookUrl) }
      </div>
    )
  }

  renderLinkedin() {
    return (
      <div className="linkedin">
        <i className="fa fa-linkedin-square"></i>
        { this.renderSocialInside(this.props.organization.linkedinUrl) }
      </div>
    )
  }

  renderTwitter() {
    return (
      <div className="twitter">
        <i className="fa fa-twitter-square"></i>
        { this.renderSocialInside(this.props.organization.twitterUrl) }
      </div>
    )
  }
}
