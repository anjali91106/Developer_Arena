import React, { useState } from 'react';
import styles from './TaskInput.module.css';

const TaskInput = ({ addTask }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue.trim());
      setInputValue('');
      setError('');
    } else {
      setError('Please type a task text');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <form className={styles.taskInput} onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (error) setError('');
        }}
        placeholder="Add a new task..."
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      <button type="submit" className={styles.addButton}>
        Add Task
      </button>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </form>
  );
};

export default TaskInput;
