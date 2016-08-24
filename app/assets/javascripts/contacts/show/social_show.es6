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
    return(
      <button className="btn btn-secondary btn-edit"
              onClick={this.props.toggleEditMode}>
        Modifier
      </button>
    )
  }

  renderFacebook() {
    return (
      <div className="col-md-12 facebook">
        <i className="fa fa-facebook-square"></i>
        <a href={ this.props.contact.facebookUrl } target="_blank">
          { this.props.contact.facebookUrl }
        </a>
      </div>
    )
  }

  renderLinkedin() {
    return (
      <div className="col-md-12 linkedin">
        <i className="fa fa-linkedin-square"></i>
        <a href={ this.props.contact.linkedinUrl } target="_blank">
          { this.props.contact.linkedinUrl }
        </a>
      </div>
    )
  }

  renderTwitter() {
    return (
      <div className="col-md-12 twitter">
        <i className="fa fa-twitter-square"></i>
        <a href={ this.props.contact.twitterUrl } target="_blank">
          { this.props.contact.twitterUrl }
        </a>
      </div>
    )
  }
}

module.exports = SocialShow
