import React, { useState } from 'react';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, deleteTask, toggleComplete, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== task.text) {
      editTask(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className={styles.checkbox}
      />
      
      {isEditing ? (
        <div className={styles.editForm}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.editInput}
            autoFocus
          />
          <button onClick={handleEdit} className={styles.saveButton}>
            Save
          </button>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span 
            className={styles.text}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.text}
          </span>
          <div className={styles.actions}>
            <button 
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
              title="Edit task"
            >
              Edit
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              className={styles.deleteButton}
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
