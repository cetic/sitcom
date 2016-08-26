class GeneralShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className="general">
        <Link to={'/' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderEdit() }

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-8">
            <h1>
              { this.props.organization.name }
            </h1>
          </div>
        </div>

        <div className="row row-contact-infos">
          {this.props.organization.description}
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

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.organization.pictureUrl} />
      </div>
    )
  }

}

module.exports = GeneralShow
