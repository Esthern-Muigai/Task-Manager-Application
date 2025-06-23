// task-manager-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import './App.css'; // Import the CSS file for styling

// Define the API URL. This is the crucial part that must match your PHP API path.
// Based on your provided path: C:\xampp\htdocs\task-manager\task-manager-api\api.php
const API_URL = 'http://localhost/task-manager/task-manager-api/api.php';

function App() {
  // State variables for managing application data and UI status
  const [tasks, setTasks] = useState([]); // Array to store fetched tasks
  const [newTaskTitle, setNewTaskTitle] = useState(''); // State for the new task input field
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error message display

  // useEffect Hook to fetch tasks when the component mounts
  // This runs once after the initial render because of the empty dependency array []
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Attempting to fetch from API_URL:", API_URL); // Debugging log
      try {
        const response = await axios.get(API_URL); // Make a GET request to the API
        console.log("API Response data:", response.data); // Debugging log
        setTasks(response.data); // Update tasks state with data from API
        setLoading(false); // Turn off loading indicator
      } catch (err) {
        console.error("Failed to fetch tasks. API Error details:", err); // Log full error object
        setError('Failed to fetch tasks. Please check your API server and network connection.');
        setLoading(false); // Turn off loading indicator even on error
      }
    };
    fetchTasks(); // Call the async function
  }, []);

  // Function to handle adding a new task
  const addTask = async (e) => {
    e.preventDefault(); // Prevent default form submission that would reload the page

    // Basic validation: Don't add empty tasks
    if (newTaskTitle.trim() === '') {
      setError('Task title cannot be empty.');
      return;
    }

    try {
      // Make a POST request to the API to create a new task
      const response = await axios.post(API_URL, { title: newTaskTitle });

      // Assuming API returns an ID for the newly created task (from PHP's lastInsertId())
      const newTaskId = response.data.id;

      // Optimistically update the UI: Add the new task to the local state immediately
      // This makes the UI feel faster, but it should be reverted if the API call fails
      setTasks([
        { id: newTaskId, title: newTaskTitle, completed: 0, created_at: new Date().toISOString() },
        ...tasks // Add the new task at the beginning of the list
      ]);
      setNewTaskTitle(''); // Clear the input field
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to add task. API Error details:", err); // Log full error object
      setError('Failed to add task. Please try again.');
      // Revert optimistic update if API call failed
      // For simplicity, we just set the tasks back to the original state,
      // but in a real app, you might re-fetch or find the specific task to remove.
      const originalTasks = tasks.filter(task => task.id !== newTaskTitle); // Simple revert
      setTasks(originalTasks);
    }
  };

  // Function to toggle the completion status of a task
  const toggleTaskCompleted = async (id, currentCompletedStatus) => {
    // Determine the new completed status (0 for incomplete, 1 for complete)
    const newCompletedStatus = currentCompletedStatus === 0 ? 1 : 0;

    // Optimistically update the UI: change the task's status immediately
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: newCompletedStatus } : task
    );
    setTasks(updatedTasks);

    try {
      // Make a PUT request to the API to update the task's completed status
      await axios.put(`${API_URL}/${id}`, { completed: newCompletedStatus });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to toggle task completion. API Error details:", err); // Log full error object
      setError('Failed to update task status. Please try again.');
      // Revert the optimistic update if API call failed
      setTasks(tasks);
    }
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    const originalTasks = tasks; // Store original tasks for potential revert
    // Optimistically update the UI: remove the task immediately
    setTasks(tasks.filter(task => task.id !== id));

    try {
      // Make a DELETE request to the API to remove the task
      await axios.delete(`${API_URL}/${id}`);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to delete task. API Error details:", err); // Log full error object
      setError('Failed to delete task. Please try again.');
      // Revert optimistic update if API call failed
      setTasks(originalTasks);
    }
  };

  // Conditional rendering based on loading and error states
  if (loading) {
    return <div className="app-container"><p>Loading tasks...</p></div>;
  }

  if (error) {
    return <div className="app-container error-message"><p>{error}</p></div>;
  }

  return (
    <div className="app-container">
      <h1>Task Manager</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks-message">No tasks yet! Add one above.</p>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span onClick={() => toggleTaskCompleted(task.id, task.completed)} className="task-title">
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)} className="delete-button">Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;