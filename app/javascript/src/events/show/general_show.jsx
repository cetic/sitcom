import EventDate      from '../shared/event_date.jsx'
import CustomDropzone from '../../shared/custom_dropzone.jsx'
import Tags           from '../../shared/tags.jsx'

export default class GeneralShow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  destroyEvent() {
    if(confirm("Supprimer cet évènement ?")) {
      http.delete(this.props.eventPath)
      this.props.router.replace('events' + this.props.search)
    }
  }

  tagsPath() {
    return this.props.tagOptionsPath.slice(0, -8); // remove '/options'
  }

  render() {
    return (
      <div className="general">
        <Link to={'/events' + this.props.search} className="back">
          Retour à la liste
        </Link>

        <div className="row">
          <div className="col-sm-3 col-xs-4">
            { this.renderPicture() }
          </div>
          <div className="col-sm-9">
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

            { this.renderTags() }

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

  renderTags() {
    return (
      <Tags canWriteItems={this.props.permissions.canWriteEvents}
            itemType="event"
            itemTags={this.props.event.tags}
            itemId={this.props.event.id}
            itemPath={this.props.eventPath}
            tagsPath={this.tagsPath()}
            tagOptionsPath={this.props.tagOptionsPath} />
    )
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
                      clickable={['.general .img-thumbnail', '.general .update-image']}
                      acceptedFiles="image/*">
        <img className="img-thumbnail"
             src={this.props.event.previewPictureUrl}
             style={{ minHeight: this.props.previewPictureUrl ? 'inherit' : '150px' }} />
      </CustomDropzone>
    )
  }
}
