class SocialShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className="social">
        <div className="row">
          { this.renderEdit() }
          { this.renderFacebook() }
          { this.renderLinkedin() }
          { this.renderTwitter() }
        </div>
      </div>
    );
  }

  renderEdit() {
    if(this.props.permissions.canWriteContacts) {
      return(
        <button className="btn btn-secondary btn-edit"
                onClick={this.props.toggleEditMode}>
          Modifier
        </button>
      )
    }
  }

  renderSocialInside(url) {
    if(url == '') {
      return <em>non-renseigné</em>;
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
      <div className="col-md-12 facebook">
        <i className="fa fa-facebook-square"></i>
        { this.renderSocialInside(this.props.contact.facebookUrl) }
      </div>
    )
  }

  renderLinkedin() {
    return (
      <div className="col-md-12 linkedin">
        <i className="fa fa-linkedin-square"></i>
        { this.renderSocialInside(this.props.contact.linkedinUrl) }
      </div>
    )
  }

  renderTwitter() {
    return (
      <div className="col-md-12 twitter">
        <i className="fa fa-twitter-square"></i>
        { this.renderSocialInside(this.props.contact.twitterUrl) }
      </div>
    )
  }
}

module.exports = SocialShow
