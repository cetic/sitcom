export default class extends React.Component {

  render() {
    if(this.props.project.startDate || this.props.endDate) {
      var startDateSpan = <span>{moment(this.props.project.startDate).format('DD/MM/YYYY')}</span>;
      var endDateSpan   = <span>{moment(this.props.project.endDate  ).format('DD/MM/YYYY')}</span>;

      return (
        <div>{startDateSpan}&nbsp;&rarr;&nbsp;{endDateSpan}</div>
      )
    }
    else {
      return (
        <div />
      );
    }
  }

}
