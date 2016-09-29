import DateField from '../../shared/date_field.es6'

class GeneralEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name:        this.props.event.name,
      description: this.props.event.description,
      place:       this.props.event.place,
      websiteUrl:  this.props.event.websiteUrl,
      happensOn:   this.props.event.happensOn,
      errors:      ''
    }
  }

  backendUpdateOrganization() {
    var params = {
      event: {
        name:        this.state.name,
        description: this.state.description,
        place:       this.state.place,
        websiteUrl:  this.state.websiteUrl,
        happensOn:   this.state.happensOn
      }
    }

    http.put(this.props.eventPath, params, (data) => {
      if(!data.success) {
        this.setState({ errors: data.errors })
      }
      else {
        this.props.toggleEditMode()
      }
    })
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
        <Link to={'/events/' + this.props.search} className="back">
          Retour à la liste
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

            { this.renderHappensOn() }
            { this.renderPlace() }

            <div style={{ clear: 'both' }}></div>

            { this.renderWebsite() }
            { this.renderDescription() }
          </div>
        </div>

        { this.renderActions() }
      </div>
    )
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
        <img className="img-thumbnail" src={this.props.event.previewPictureUrl} />
      </div>
    )
  }

  renderName() {
    return (
      <div className="name">
        <input type="text"
               className="name full"
               defaultValue={this.state.name}
               onChange={this.updateName.bind(this)} />
      </div>
    )
  }

  renderDescription() {
    return (
      <div className="description">
        <label>Description</label>

        <textarea className="description"
                  defaultValue={this.state.description}
                  onChange={this.updateDescription.bind(this)} />
      </div>
    )
  }

  renderPlace() {
    return (
      <div className="place">
        <label>Lieu</label>

        <input type="text"
               className="place"
               defaultValue={this.state.place}
               onChange={this.updatePlace.bind(this)} />
      </div>
    )
  }

  renderWebsite() {
    return (
      <div className="website">
        <label>Site Web</label>

        <input type="text"
               className="website-url"
               defaultValue={this.state.websiteUrl}
               onChange={this.updateWebsiteUrl.bind(this)} />
      </div>
    )
  }

  renderHappensOn() {
    return (
      <div className="dates">
        <label>Date</label>

        <DateField value={this.state.happensOn}
                   onChange={this.updateHappensOn.bind(this)} />
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
                onClick={this.backendUpdateOrganization.bind(this)}>
          Enregistrer
        </button>
      </div>
    )
  }
}

module.exports = GeneralEdit
