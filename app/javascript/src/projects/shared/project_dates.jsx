export default class ProjectDates extends React.Component {

  render() {
    var startDateSpan = <em>N/A</em>
    var endDateSpan   = <em>N/A</em>

    if(this.props.startDate) {
      var startDateSpan = <span>{moment(this.props.startDate).format('DD/MM/YYYY')}</span>
    }

    if(this.props.endDate) {
      var endDateSpan = <span>{moment(this.props.endDate).format('DD/MM/YYYY')}</span>
    }

    return (
      <div>{startDateSpan}&nbsp;&rarr;&nbsp;{endDateSpan}</div>
    )
  }

}
