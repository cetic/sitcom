class ContactsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hello: 'hello'
    };
  }

  render() {
    return `
      <div>
        <span>Hello World</span>
      </div>
    `
  }
}

module.exports = ContactsIndex;
