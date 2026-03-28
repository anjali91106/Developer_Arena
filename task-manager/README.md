# Task Manager

A React-based task management application with full CRUD operations, filtering, sorting, and local storage persistence.

## Features

- ✅ **Add Tasks**: Create new tasks with a simple input form
- ✏️ **Edit Tasks**: Double-click or use the Edit button to modify existing tasks
- 🗑️ **Delcete Tasks**: Remove tasks you no longer need
- ☑️ **Complete Tasks**: Mark tasks as complete with checkboxes
- 🔍 **Filter Tasks**: View all, active, or completed tasks
- 📊 **Sort Tasks**: Sort by date or alphabetically
- 💾 **Local Storage**: Tasks persist between browser sessions
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React 18**: Frontend framework with hooks (useState, useEffect)
- **React Scripts**: Build tool and development server
- **Local Storage API**: Data persistence
- **CSS3**: Modern styling with flexbox and grid

## Installation and Setup

1. **Navigate to the project directory:**
   ```bash
   cd task-manager
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Usage Instructions

### Adding Tasks
- Type your task in the input field and press "Add Task" or hit Enter

### Editing Tasks
- **Double-click** on any task text to edit it inline
- Or click the "Edit" button and modify the text
- Press Enter to save or Escape to cancel

### Completing Tasks
- Click the checkbox next to a task to mark it as complete
- Completed tasks will show with a strikethrough effect

### Deleting Tasks
- Click the "Delete" button next to any task to remove it

### Filtering Tasks
- Use the filter buttons to view:
  - **All**: Show all tasks
  - **Active**: Show only incomplete tasks
  - **Completed**: Show only completed tasks

### Sorting Tasks
- Use the dropdown to sort tasks by:
  - **Date**: Newest tasks first (default)
  - **Alphabetical**: A-Z order

## Data Persistence

All tasks are automatically saved to your browser's local storage. This means:
- Your tasks persist even after closing the browser
- No database or server is required
- Data is stored locally on your device

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (one-way operation)

## Browser Support

This application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
