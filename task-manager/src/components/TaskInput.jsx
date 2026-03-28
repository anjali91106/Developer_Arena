import React, { useState } from 'react';
import styles from './TaskInput.module.css';

const TaskInput = ({ addTask }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form className={styles.taskInput} onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
        className={styles.input}
      />
      <button type="submit" className={styles.addButton}>
        Add Task
      </button>
    </form>
  );
};

export default TaskInput;
