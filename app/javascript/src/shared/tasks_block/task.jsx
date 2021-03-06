import DatePicker from 'react-datepicker'
import UserSelect from '../../shared/user_select.jsx'

export default class Task extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode:          false,
      taskName:          '',
      taskText:          '',
      taskExecutionDate: null,
      taskUserId:        null
    }
  }

  void() {}

  updateTaskName(e) {
    this.setState({
      taskName: e.target.value
    })
  }

  updateTaskText(e) {
    this.setState({
      taskText: e.target.value
    })
  }

  updateTaskExecutionDate(date) {
    this.setState({
      taskExecutionDate: date
    })
  }

  updateTaskUserId(option) {
    const taskUserId = option ? option.value : null

    this.setState({ taskUserId })
  }

  remove() {
    if(confirm("Supprimer définitivement cette tâche ?")) {
      http.delete(`${this.props.task.path}`)
    }
  }

  edit() {
    const taskExecutionDate = this.props.task.executionDate ? moment(this.props.task.executionDate) : null

    this.setState({
      editMode:          true,
      taskName:          this.props.task.name,
      taskText:          this.props.task.text,
      taskExecutionDate: taskExecutionDate,
      taskUserId:        this.props.task.userId
    }, () => {
      $(this.refs.taskName).focus()
    })
  }

  toggle() {
    http.put(`${this.props.task.path}/toggle`)
  }

  save() {
    const taskExecutionDate = this.state.taskExecutionDate ? this.state.taskExecutionDate.format('YYYY-MM-DD') : null

    var params = {
      task: {
        name:          this.state.taskName,
        text:          this.state.taskText,
        executionDate: taskExecutionDate,
        userId:        this.state.taskUserId
      }
    }

    http.put(`${this.props.task.path}`, params, (data) => {
      if(data.success) {
        this.cancel()
      }
    })
  }

  cancel() {
    this.setState({
      editMode: false
    })
  }

  render() {
    return (
      <div className="task">
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if(this.state.editMode) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <input className="form-control"
                     type="text"
                     ref="taskName"
                     placeholder="Tâche"
                     value={this.state.taskName}
                     onChange={this.updateTaskName.bind(this)} />
            </div>

            <div className="col-md-4">
              <UserSelect
                value={this.state.taskUserId}
                onChange={this.updateTaskUserId.bind(this)}
                placeholder="Utilisateur assigné"
              />
            </div>

            <div className="col-md-2">
              <DatePicker showYearDropdown
                          fixedHeight
                          selected={this.state.taskExecutionDate}
                          locale='fr-be'
                          onChange={this.updateTaskExecutionDate.bind(this)}
                          placeholder="Date d'exécution"
                          className="form-control" />
            </div>
          </div>

          <textarea className="form-control"
                    ref="taskText"
                    value={this.state.taskText}
                    placeholder="Détails"
                    onChange={this.updateTaskText.bind(this)} />

          <div className="actions">
            <button onClick={this.cancel.bind(this)}
                    className="btn btn-default">
              Annuler
            </button>

            <button onClick={this.save.bind(this)}
                    className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="task-name">
            <input type="checkbox"
                   onChange={this.void.bind(this)}
                   onClick={this.toggle.bind(this)}
                   checked={this.props.task.done} />

            <span style={{ textDecoration: this.props.task.done ? 'line-through' : 'none' }}>
              { this.props.task.name }
            </span>

            { this.renderAssignedUser() }
            { this.renderExecutionDateBadge() }
          </div>

          { this.renderText() }
          { this.renderButtons() }
        </div>
      )
    }
  }

  renderText() {
    if(!_.isEmpty(this.props.task.text)) {
      return (
        <div className="task-text"
             dangerouslySetInnerHTML={ {__html: this.props.task.formattedText } }>
        </div>
      )
    }
  }

  renderAssignedUser() {
    if(this.props.task.userId) {
      return (
        <span className="assigned-user">
          (assignée à {this.props.task.userName})
        </span>
      )
    }
  }

  renderExecutionDateBadge() {
    let className = 'execution-date-badge'

    if(!this.props.task.done && this.props.task.executionDate) {
      if(moment().isAfter(this.props.task.executionDate)) {
        className += ' red'
      }
      else if(moment().isBefore(this.props.task.executionDate)) {
        className += ' green'
      }
    }

    if(this.props.task.executionDate) {
      return (
        <span className={className}>
          {moment(this.props.task.executionDate).format('DD/MM/YYYY')}
        </span>
      )
    }
  }

  renderButtons() {
    if(this.props.canWrite && !this.props.task.done) {
      return (
        <div className="buttons">
          <button className="btn btn-primary btn-xs"
                  key="edit"
                  onClick={this.edit.bind(this)}>
            <i className="fa fa-edit"></i>
          </button>

          <button className="btn btn-danger btn-xs"
                  key="delete"
                  onClick={this.remove.bind(this)}>
            <i className="fa fa-times"></i>
          </button>
        </div>
      )
    }
  }

}
