export default class extends React.Component {

  render() {
    if(this.props.event.happensOn) {
      return (
        <div>{moment(this.props.event.happensOn).format('DD/MM/YYYY')}</div>
      )
    }
    else {
      return (
        <div />
      );
    }
  }

}
