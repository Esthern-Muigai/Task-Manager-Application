Simple Task Manager Application
Overview
This is a full-stack web application designed to help users efficiently manage their daily tasks. It provides an intuitive interface for interacting with tasks, while all data is reliably stored and managed on a backend server. This project serves as a foundational example of how a modern web frontend communicates with a custom API to achieve persistent data storage.

Features
The Task Manager allows users to perform standard task management operations:

View Tasks: Display a real-time list of all tasks.
Add New Tasks: Easily create new tasks with a title.
Toggle Completion Status: Mark tasks as complete or incomplete with a simple click.
Delete Tasks: Remove unwanted tasks from the list.
Data Persistence: All task data is stored securely in a database, ensuring that tasks remain available even after closing and reopening the application.
Technologies Used
This application is built using a combination of popular web technologies:

Frontend:
React: For building the dynamic and responsive user interface.
HTML5 & CSS3: For structuring and styling the web application.
JavaScript: The core programming language for frontend logic.
Axios: A library used for making HTTP requests from the frontend to the backend API.
npm: Used for managing project dependencies and running development scripts.
Backend:
PHP: Powers the server-side logic and handles requests from the frontend.
MySQL: A robust relational database system used for storing all task information.
PDO: PHP Data Objects, used for secure and efficient interaction with the MySQL database.
API Communication:
RESTful API: Defines the standardized way the frontend and backend communicate, using standard HTTP methods (GET, POST, PUT, DELETE) for CRUD operations on tasks.
Local Development Environment:
XAMPP: Provides the necessary Apache web server, MySQL database, and PHP runtime environment on a local machine.

Future Enhancements
Potential improvements and features that could be added include:

The ability to edit existing task titles.
Filtering options (e.g., showing only active, completed, or all tasks).
Sorting tasks by various criteria (e.g., creation date, alphabetical).
Implementing pagination for larger task lists.
Adding user authentication and authorization to allow individual users to manage their own task lists