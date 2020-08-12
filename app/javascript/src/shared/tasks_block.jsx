import Task    from './tasks_block/task.jsx'
import NewTask from './tasks_block/new_task.jsx'

export default class TasksBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      doneVisible: false
    }
  }

  void() {}

  componentDidMount() {
    // Scroll to tasks if url contains #tasks
    if(_.includes(window.location.hash, '#tasks')) {
      document.getElementById('tasks').scrollIntoView()
    }
  }

  toggleDoneVisible() {
    this.setState({ doneVisible: !this.state.doneVisible })
  }

  render() {
    return (
      <div className="tasks-block">
        <div className="row">
          <div className="col-md-12">
            {this.renderDoneVisibleToggle()}

            <h3 id="tasks">Tâches</h3>

            {this.renderPendingTasks()}
            {this.renderDoneTasks()}

            {this.renderNewTask()}
           </div>
        </div>
      </div>
    )
  }

  renderDoneVisibleToggle() {
    return (
      <div style={{ float: 'right' }}>
        <input
          type="checkbox"
          onChange={this.void}
          onClick={this.toggleDoneVisible.bind(this)}
          checked={this.state.doneVisible}
        />

        <label>Afficher les tâches clôturées</label>
      </div>
    )
  }

  renderPendingTasks() {
    const tasks = _.filter(this.props.item.tasks, { done: false })

    return this.renderTasks(
      _.sortBy(tasks, (task) => {
        return task.executionDate
      })
    )
  }

  renderDoneTasks() {
    const tasks = _.filter(this.props.item.tasks, { done: true })

    if(this.state.doneVisible) {
      return this.renderTasks(
        _.sortBy(tasks, (task) => {
          return task.doneAt
        })
      )
    }
  }

  renderTasks(tasks) {
    return _.map(tasks, (task) => {
      return (
        <Task key={task.id}
              task={task}
              canWrite={this.props.canWrite} />
      )
    })
  }



  renderNewTask() {
    if(this.props.canWrite) {
      return (
        <NewTask item={this.props.item}
                 currentUserId={this.props.currentUserId} />
      )
    }
  }

}
