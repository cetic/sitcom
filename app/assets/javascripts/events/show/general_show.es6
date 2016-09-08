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

            <div className="description">
              {this.props.event.description}
            </div>
          </div>
        </div>

        { this.renderButtons() }
      </div>
    );
  }

  renderButtons() {
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
