class PreviousNextNav extends React.Component {

  render() {
    if(this.props.hasPrevious) {
      var previousLink = (
        <a href="javascript:;" onClick={this.props.gotoPrevious}>Précédent</a>
      )
    }

    var nextLink = (
      <a href="javascript:;" onClick={this.props.gotoNext}>Suivant</a>
    )

    return (
      <div>
        {previousLink}
        {nextLink}
      </div>
    )
  }

}

export default PreviousNextNav
