import Task    from './tasks_block/task.jsx'
import NewTask from './tasks_block/new_task.jsx'

export default class TasksBlock extends React.Component {

  render() {
    return (
      <div className="tasks-block">
        <div className="row">
          <div className="col-md-12">
            <h3>Tasks</h3>

            {this.renderTasks()}
            {this.renderNewTask()}
           </div>
        </div>
      </div>
    )
  }

  renderTasks() {
    return _.map(this.props.item.tasks, (task) => {
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
        <NewTask item={this.props.item} />
      )
    }
  }

}
