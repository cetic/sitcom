class Note extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className="note">
        {this.props.note.text}
      </div>
    )
  }

}

module.exports = Note
