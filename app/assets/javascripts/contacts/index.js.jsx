import Bidon from './index/bidon.js.jsx'

class ContactsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hello: 'hello'
    };
  }

  render() {
    return (
      <div>
        <span>Hello World {this.state.hello}</span>
        <Bidon />
      </div>
    )
  }
}

module.exports = ContactsIndex
