import Contact  from './contact.es6'
import Infinite from 'react-infinite'

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="contacts items">
        { this.renderContactsContainer() }
      </div>
    )
  }

  renderContactsContainer() {
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
      return (
        <Infinite useWindowAsScrollContainer
                  elementHeight={84}>
          { this.renderContacts() }
        </Infinite>
      )
    }
  }

  renderContacts() {
    return _.map(this.props.contacts, (contact) => {
      return (
        <Contact key={contact.id}
                 permissions={this.props.permissions}
                 contact={contact}
                 search={this.props.search}
                 tagOptionsPath={this.props.tagOptionsPath}
                 updateSelected={this.props.updateSelected}
                 pushTagIdsFilter={this.props.pushTagIdsFilter}
                 pushFieldIdsFilter={this.props.pushFieldIdsFilter} />
      )
    })
  }
}

module.exports = Contacts
