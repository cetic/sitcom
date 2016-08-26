import Contact from './contact.es6'

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infiniteScrollOffset: 200
    };
  }

  componentDidMount() {
    this.bindInfiniteScroll();
  }

  componentWillUnmount() {
    this.unbindInfiniteScroll();
  }

  bindInfiniteScroll() {
    $(window).scroll(() => {
      if(this.props.infiniteLoaded && this.props.infiniteEnabled && this.props.loaded) {
        if($(window).scrollTop() + $(window).height() >= $(document).height() - this.state.infiniteScrollOffset) {
          this.props.loadNextBatchFromBackend();
        }
      }
    })
  }

  unbindInfiniteScroll() {
    $(window).unbind('scroll');
  }

  render() {
    return (
      <div className="contacts">
        { this.renderContacts() }
        { this.renderInfiniteLoading() }
      </div>
    )
  }

  renderContacts() {
    if(!this.props.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      )
    }
    else if(this.props.contacts.length == 0) {
      return (
        <div className="blank-slate">
          Aucun résultat
        </div>
      )
    }
    else {
      return _.map(this.props.contacts, (contact) => {
        return (
          <Contact key={contact.id}
                   contact={contact}
                   search={this.props.search} />
        );
      });
    }
  }

  renderInfiniteLoading() {
    if(!this.props.infiniteLoaded && this.props.loaded) {
      return (
        <div className="loading">
          <img src={this.props.loadingImagePath}/>
        </div>
      );
    }
  }
}

module.exports = Contacts
