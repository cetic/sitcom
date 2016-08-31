import DateField from '../../shared/date_field.es6'

class GeneralEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:        this.props.event.name,
      description: this.props.event.description,
      place:       this.props.event.place,
      websiteUrl:  this.props.event.websiteUrl,
      happensOn:   this.props.event.happensOn,
      errors:      ''
    };
  }

  backendUpdateOrganization() {
    var params = {
      _method: 'PUT',
      event: {
        name:        this.state.name,
        description: this.state.description,
        place:       this.state.place,
        websiteUrl:  this.state.websiteUrl,
        happensOn:   this.state.happensOn
      }
    }

    $.post(this.props.eventPath, humps.decamelizeKeys(params), (data) => {
      var camelData = humps.camelizeKeys(data);

      if(!camelData.success) {
        this.setState({ errors: camelData.errors })
      }
      else {
        this.props.reloadFromBackend(this.props.toggleEditMode)
      }
    });
  }

  updateName(e) {
    this.setState({
      name: e.target.value
    })
  }

  updateDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  updatePlace(e) {
    this.setState({
      place: e.target.value
    })
  }

  updateWebsiteUrl(e) {
    this.setState({
      websiteUrl: e.target.value
    })
  }

  updateHappensOn(v) {
    this.setState({
      happensOn: v
    })
  }

  render() {
    return (
      <div className="general edit">
        <Link to={'/' + this.props.search} className="back">
          Retour
        </Link>

        <div className="row">
          <div className="col-md-12">
            { this.renderErrors() }
          </div>

          <div className="col-md-3">
            { this.renderPicture() }
          </div>

          <div className="col-md-9">
            <h1>
              { this.renderName() }
            </h1>
          </div>
        </div>

        <div className="row row-event-infos">
          { this.renderDescription() }
          { this.renderPlace() }
          { this.renderWebsiteUrl() }
          { this.renderHappensOn() }
        </div>

        { this.renderActions() }
      </div>
    );
  }

  renderErrors() {
    if(this.state.errors.length) {
      return (
        <div className="alert alert-danger" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          { this.state.errors }
        </div>
      )
    }
  }

  renderPicture() {
    return (
      <div className="picture">
        <img className="img-thumbnail" src={this.props.event.pictureUrl} />
      </div>
    )
  }

  renderName() {
    return (
      <div className="name">
        <input type="text"
               className="name"
               defaultValue={this.state.name}
               onChange={this.updateName.bind(this)} />
      </div>
    )
  }

  renderDescription() {
    return (
      <div className="col-md-4">
        <h3>Description</h3>

        <textarea className="description"
                  defaultValue={this.state.description}
                  onChange={this.updateDescription.bind(this)} />
      </div>
    )
  }

  renderPlace() {
    return (
      <div className="col-md-4">
        <h3>Lieu</h3>

        <input type="text"
               className="place"
               defaultValue={this.state.place}
               onChange={this.updatePlace.bind(this)} />
      </div>
    )
  }

  renderWebsiteUrl() {
    return (
      <div className="col-md-4">
        <h3>Site Web</h3>

        <input type="text"
               className="website-url"
               defaultValue={this.state.websiteUrl}
               onChange={this.updateWebsiteUrl.bind(this)} />
      </div>
    )
  }

  renderHappensOn() {
    return (
      <div className="col-md-4">
        <h3>Date</h3>

        <DateField value={this.state.happensOn}
                   onChange={this.updateHappensOn.bind(this)} />
      </div>
    )
  }

  renderActions() {
    return (
      <div className="actions">
        <button className="btn btn-secondary"
                onClick={this.props.toggleEditMode}>
          Annuler
        </button>

        <button className="btn btn-secondary"
                onClick={this.backendUpdateOrganization.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = GeneralEdit
