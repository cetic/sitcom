export default class FollowButton extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loaded:  false,
      status:  '', // "followed" / "unfollowed"
      hovered: false
    }
  }

  componentDidMount() {
    this.reloadFromBackend()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.itemId != this.props.itemId) {
      this.reloadFromBackend()
    }
  }

  hover() {
    this.setState({
      hovered: true
    })
  }

  unhover() {
    this.setState({
      hovered: false
    })
  }

  reloadFromBackend(callback) {
    http.get(this.props.itemPath + '/follow_status.json', {}, (data) => {
      this.setState({
        loaded: true,
        status: data.status
      })
    })
  }

  toggleFollow() {
    if(this.state.status == 'followed') {
      this.unfollow()
    }
    else {
      this.follow()
    }
  }

  follow() {
    http.get(this.props.itemPath + '/follow.json', {}, (data) => {
      this.setState({
        status: data.status
      })
    })
  }

  unfollow() {
    http.get(this.props.itemPath + '/unfollow.json', {}, (data) => {
      this.setState({
        status: data.status
      })
    })
  }

  renderAction() {
    if(this.state.status == 'followed') {
      if(this.state.hovered) {
        return 'Unfollow'
      }
      else {
        return 'Following'
      }
    }
    else {
      return 'Follow'
    }
  }

  render() {
    if(this.state.loaded) {
      const buttonClasses = this.state.status == 'followed' ? 'btn btn-primary' : 'btn btn-default'
      let buttonStyles = {}

      if(this.renderAction() == 'Unfollow') {
        buttonStyles = { backgroundColor: '#f35858' }
      }
      else if(this.renderAction() == 'Following') {
        buttonStyles = { backgroundColor: '#4dad11' }
      }

      return (
        <div className="follow-button">
          <button className={buttonClasses}
                  style={buttonStyles}
                  onClick={this.toggleFollow.bind(this)}
                  onMouseEnter={this.hover.bind(this)}
                  onMouseLeave={this.unhover.bind(this)}>
            { this.renderAction() }
          </button>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

}
