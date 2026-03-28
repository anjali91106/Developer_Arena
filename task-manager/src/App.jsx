import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import styles from './App.module.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...tasks];

    if (filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }

    filteredTasks.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });

    return filteredTasks;
  };

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Task Manager</h1>
      </header>
      <main className={styles.appMain}>
        <TaskInput addTask={addTask} />
        
        <div className={styles.controls}>
          <div className={styles.filterControls}>
            <button 
              className={filter === 'all' ? styles.active : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'active' ? styles.active : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={filter === 'completed' ? styles.active : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          
          <div className={styles.sortControls}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>
          </div>
        </div>

        <TaskList 
          tasks={getFilteredAndSortedTasks()}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
        />
        
        <div className={styles.taskStats}>
          <p>
            {tasks.filter(task => !task.completed).length} active tasks, 
            {tasks.filter(task => task.completed).length} completed
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
