import EventDate      from '../shared/event_date.es6'
import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyEvent() {
    if(confirm("Supprimer cet évènement ?")) {
      http.delete(this.props.eventPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('events' + this.props.search)
        }
      })
    }
  }

  render() {
    return (
      <div className="general">
        <Link to={'/events' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>
          <div className="col-md-8">
            <h1>
              { this.props.event.name }
            </h1>

            { this.renderWebsite() }

            <div className="dates">
              <EventDate event={this.props.event} />
            </div>

            <div className="place">
              {this.props.event.place}
            </div>

            <div className="description">
              {this.props.event.description}
            </div>
          </div>
        </div>

        { this.renderButtons() }
      </div>
    )
  }

  renderWebsite() {
    if(this.props.event.websiteUrl != '') {
      return (
        <div className="website">
          <a href={this.props.event.websiteUrl}
             target="_blank">
            { this.props.event.websiteUrl }
          </a>
        </div>
      )
    }
  }

  renderButtons() {
    if(this.props.permissions.canWriteEvents) {
      return (
        <div className="btn-group">
          <button type="button"
                  className="btn btn-primary"
                  onClick={this.props.toggleEditMode}>
            Modifier
          </button>
          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li>
              <a href="javascript:;"
                 onClick={this.destroyEvent.bind(this)}>
                Supprimer
              </a>
            </li>
          </ul>
        </div>
      )
    }
  }

  renderPicture() {
    return (
      <CustomDropzone url={this.props.eventPath}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.event.previewPictureUrl} />
      </CustomDropzone>
    )
  }
}

module.exports = GeneralShow
