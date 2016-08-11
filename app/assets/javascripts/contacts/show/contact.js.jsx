class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contact: {},
      loading: true
    };
  }

  componentDidMount() {
    this.reloadFromBackend()
  }

  contactPath() {
    return this.props.route.contactsPath + '/' + this.props.params.id
  }

  reloadFromBackend() {
    $.get(this.contactPath(), (data) => {
      var camelData = humps.camelizeKeys(data)

      this.setState({
        contact: camelData,
        loading: false
      })
    });
  }

  render() {
    if(this.state.loading)
      return (<div />);
    else {
      return (
        <div>
          <Link to="/">Liste</Link>
          <br />
          {this.state.contact.name}
        </div>
      );
    }
  }
}

module.exports = Contact
