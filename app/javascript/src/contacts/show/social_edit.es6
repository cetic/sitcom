class SocialEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      facebookUrl: this.props.contact.facebookUrl,
      linkedinUrl: this.props.contact.linkedinUrl,
      twitterUrl:  this.props.contact.twitterUrl,
    }
  }

  backendUpdateContact() {
    var params = {
      contact: {
        facebookUrl: this.state.facebookUrl,
        linkedinUrl: this.state.linkedinUrl,
        twitterUrl:  this.state.twitterUrl
      }
    }

    http.put(this.props.contactPath, params, () => {
      this.props.toggleEditMode()
    })
  }

  updateFacebookUrl(e) {
    this.setState({
      facebookUrl: e.target.value
    })
  }

  updateLinkedinUrl(e) {
    this.setState({
      linkedinUrl: e.target.value
    })
  }

  updateTwitterUrl(e) {
    this.setState({
      twitterUrl: e.target.value
    })
  }

  render() {
    return (
      <div className="social edit">
        <div className="row">
          <div className="col-md-7">
            { this.renderFacebook() }
            { this.renderLinkedin() }
            { this.renderTwitter() }
          </div>

          <div className="col-md-5">
            { this.renderActions() }
          </div>
        </div>
      </div>
    )
  }

  renderFacebook() {
    return (
      <div className="facebook">
        <i className="fa fa-facebook-square"></i>
        <input type="text"
               defaultValue={this.state.facebookUrl}
               onChange={this.updateFacebookUrl.bind(this)} />
      </div>
    )
  }

  renderLinkedin() {
    return (
      <div className="linkedin">
        <i className="fa fa-linkedin-square"></i>
        <input type="text"
               defaultValue={this.state.linkedinUrl}
               onChange={this.updateLinkedinUrl.bind(this)} />
      </div>
    )
  }

  renderTwitter() {
    return (
      <div className="twitter">
        <i className="fa fa-twitter-square"></i>
        <input type="text"
               defaultValue={this.state.twitterUrl}
               onChange={this.updateTwitterUrl.bind(this)} />
      </div>
    )
  }

  renderActions() {
    return (
      <div className="actions">
        <button className="btn btn-default"
                onClick={this.props.toggleEditMode}>
          Annuler
        </button>

        <button className="btn btn-primary"
                onClick={this.backendUpdateContact.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = SocialEdit
