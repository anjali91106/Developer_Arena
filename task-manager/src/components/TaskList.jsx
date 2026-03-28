import React from 'react';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

const TaskList = ({ tasks, deleteTask, toggleComplete, editTask }) => {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No tasks found. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
