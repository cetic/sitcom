import DatePicker from 'react-datepicker'
import UserSelect from '../../shared/user_select.jsx'

export default class NewTask extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      open:                 false,
      newTaskName:          '',
      newTaskText:          '',
      newTaskExecutionDate: null,
      newTaskUserId:        null
    }
  }

  open() {
    this.setState({
      open: true
    })
  }

  cancel() {
    this.setState({
      open:        false,
      newTaskName: '',
      newTaskText: ''
    })
  }

  save() {
    const newTaskExecutionDate = this.state.newTaskExecutionDate ? this.state.newTaskExecutionDate.format('YYYY-MM-DD') : null

    var params = {
      task: {
        name:          this.state.newTaskName,
        text:          this.state.newTaskText,
        executionDate: newTaskExecutionDate,
        userId:        this.state.newTaskUserId
      }
    }

    http.post(`${this.props.item.path}/tasks`, params, (data) => {
      if(data.success) {
        this.cancel()
      }
    })
  }

  updateNewTaskName(e) {
    this.setState({
      newTaskName: e.target.value
    })
  }

  updateNewTaskText(e) {
    this.setState({
      newTaskText: e.target.value
    })
  }

  updateNewTaskExecutionDate(date) {
    this.setState({
      newTaskExecutionDate: date
    })
  }

  updateNewTaskUserId(option) {
    this.setState({
      newTaskUserId: option.value
    })
  }

  render() {
    return (
      <div className="new-task">
        {this.renderOpenLink()}
        {this.renderForm()}
      </div>
    )
  }

  renderOpenLink() {
    if(!this.state.open) {
      return (
        <a href="javascript:;" onClick={this.open.bind(this)}>Nouvelle tâche</a>
      )
    }
  }

  renderForm() {
    if(this.state.open) {
      return (
        <div>
          <input className="form-control"
                 type="text"
                 ref="taskName"
                 placeholder="Tâche"
                 value={this.state.newTaskName}
                 onChange={this.updateNewTaskName.bind(this)} />

          <textarea className="form-control"
                    ref="taskText"
                    value={this.state.newTaskText}
                    placeholder="Détails"
                    onChange={this.updateNewTaskText.bind(this)} />



          <label style={{ paddingRight: 5 }}>Date d'exécution:</label>
          <DatePicker showYearDropdown
                      fixedHeight
                      selected={this.state.newTaskExecutionDate}
                      locale='fr-be'
                      onChange={this.updateNewTaskExecutionDate.bind(this)}
                      placeholder="Date d'exécution" />

          <UserSelect
            value={this.state.newTaskUserId}
            onChange={this.updateNewTaskUserId.bind(this)}
          />

          <div className="actions">
            <button className="btn btn-default"
                    onClick={this.cancel.bind(this)}>
              Annuler
            </button>

            <button className="btn btn-primary"
                    onClick={this.save.bind(this)}>
              Ajouter
            </button>
          </div>
        </div>
      )
    }
  }

}
