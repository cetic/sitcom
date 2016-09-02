import Event    from './event.es6'
import Infinite from 'react-infinite'

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="events">
        { this.renderEventsContainer() }
      </div>
    )
  }

  renderEventsContainer() {
    if(!this.props.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
    else if(this.props.events.length == 0) {
      return (
        <div className="blank-slate">
          Aucun résultat
        </div>
      )
    }
    else {
      return (
        <Infinite useWindowAsScrollContainer
                  elementHeight={116}>
          { this.renderEvents() }
        </Infinite>
      )
    }
  }

  renderEvents() {
    return _.map(this.props.events, (event) => {
      return (
        <Event key={event.id}
               event={event}
               search={this.props.search} />
      );
    });
  }
}

module.exports = Events
