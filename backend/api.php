<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from your React app
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS request (preflight for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php'; // Include database configuration

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$resource = $request_uri[count($request_uri) - 1]; // Assuming api.php is directly accessible

// Clean up resource path for task ID if it exists
$task_id = null;
if (count($request_uri) > 1 && $request_uri[count($request_uri) - 2] === 'api' && is_numeric($resource)) {
    $task_id = (int)$resource;
}

$pdo = connectDB();

switch ($method) {
    case 'GET':
        if ($task_id) {
            // Get a single task
            $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = ?");
            $stmt->execute([$task_id]);
            $task = $stmt->fetch();
            if ($task) {
                echo json_encode($task);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Task not found."]);
            }
        } else {
            // Get all tasks
            $stmt = $pdo->query("SELECT * FROM tasks ORDER BY created_at DESC");
            $tasks = $stmt->fetchAll();
            echo json_encode($tasks);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['title'])) {
            $title = $data['title'];
            $completed = isset($data['completed']) ? (int)$data['completed'] : 0;

            $stmt = $pdo->prepare("INSERT INTO tasks (title, completed) VALUES (?, ?)");
            if ($stmt->execute([$title, $completed])) {
                echo json_encode(["message" => "Task created.", "id" => $pdo->lastInsertId()]);
                http_response_code(201); // Created
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to create task."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["message" => "Title is required."]);
        }
        break;

    case 'PUT':
        if ($task_id) {
            $data = json_decode(file_get_contents("php://input"), true);
            $title = isset($data['title']) ? $data['title'] : null;
            $completed = isset($data['completed']) ? (int)$data['completed'] : null;

            $sql = "UPDATE tasks SET ";
            $params = [];
            if ($title !== null) {
                $sql .= "title = ?, ";
                $params[] = $title;
            }
            if ($completed !== null) {
                $sql .= "completed = ?, ";
                $params[] = $completed;
            }
            $sql = rtrim($sql, ", ") . " WHERE id = ?";
            $params[] = $task_id;

            if (count($params) > 1) { // Ensure at least one field to update
                $stmt = $pdo->prepare($sql);
                if ($stmt->execute($params)) {
                    if ($stmt->rowCount()) {
                        echo json_encode(["message" => "Task updated."]);
                    } else {
                        http_response_code(404);
                        echo json_encode(["message" => "Task not found or no changes made."]);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Failed to update task."]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["message" => "No valid fields to update."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["message" => "Task ID is required for PUT."]);
        }
        break;

    case 'DELETE':
        if ($task_id) {
            $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
            if ($stmt->execute([$task_id])) {
                if ($stmt->rowCount()) {
                    http_response_code(204); // No Content
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "Task not found."]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to delete task."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["message" => "Task ID is required for DELETE."]);
        }
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(["message" => "Method not allowed."]);
        break;
}
?>