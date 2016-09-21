class SocialShow extends React.Component {
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
    if(this.props.permissions.canWriteContacts) {
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
      return (
        <a href={ url } target="_blank">
          { url }
        </a>
      )
    }
  }

  renderFacebook() {
    return (
      <div className="facebook">
        <i className="fa fa-facebook-square"></i>
        { this.renderSocialInside(this.props.contact.facebookUrl) }
      </div>
    )
  }

  renderLinkedin() {
    return (
      <div className="linkedin">
        <i className="fa fa-linkedin-square"></i>
        { this.renderSocialInside(this.props.contact.linkedinUrl) }
      </div>
    )
  }

  renderTwitter() {
    return (
      <div className="twitter">
        <i className="fa fa-twitter-square"></i>
        { this.renderSocialInside(this.props.contact.twitterUrl) }
      </div>
    )
  }
}

module.exports = SocialShow
