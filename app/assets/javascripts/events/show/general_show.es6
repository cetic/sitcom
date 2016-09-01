import EventDate      from '../shared/event_date.es6'
import CustomDropzone from '../../shared/custom_dropzone.es6'

class GeneralShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  destroyEvent() {
    if(confirm("Supprimer cet évènement ?")) {
      http.delete(this.props.eventPath, {}, (data) => {
        if(data.success) {
          this.props.router.replace('events')
          setTimeout(this.props.reloadIndexFromBackend, 1500)
        }
      });
    }
  }

  render() {
    return (
      <div className="general">
        <Link to={'/events' + this.props.search} className="back">
          Retour
        </Link>

        { this.renderEdit() }
        { this.renderDestroy() }

        <div className="row">
          <div className="col-md-3">
            { this.renderPicture() }
          </div>
          <div className="col-md-8">
            <h1>
              { this.props.event.name }
            </h1>

            <EventDate event={this.props.event} />

            {this.props.event.place}
          </div>
        </div>

        <div className="row row-contact-infos">
          {this.props.event.description}
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

  renderDestroy() {
    return(
      <button className="btn btn-secondary btn-edit"
              onClick={this.destroyEvent.bind(this)}>
        Supprimer
      </button>
    )
  }

  renderPicture() {
    return (
      <CustomDropzone url={this.props.eventPath}
                      afterSuccess={this.props.reloadFromBackend}
                      acceptedFiles="image/*">
        <img className="img-thumbnail" src={this.props.event.previewPictureUrl} />
      </CustomDropzone>
    )
  }
}

module.exports = GeneralShow
