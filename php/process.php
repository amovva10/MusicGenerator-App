<?php
// Database connection parameters
$servername = "your_servername";
$username = "your_username";
$password = "your_password";
$database = "your_database";

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the connection 
if ($conn->connect_error) {
    // If connection fails, terminate and display error message
    die("Connection failed: " . $conn->connect_error);
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get mood and language from the POST data
    if (isset($_POST['mood']) && isset($_POST['language'])) {
        $mood = $_POST['mood'];
        $language = $_POST['language'];

        // Log mood and language in debug log file
        file_put_contents('debug.log', "Received Mood: $mood, Language: $language\n", FILE_APPEND);

        // Find the table name based on the received mood
        $tableName = strtolower($mood) . '_songs';

        // Call SQL query to select a random song from the specified table
        $sql = "SELECT * FROM $tableName WHERE language = ? ORDER BY RAND() LIMIT 1";

        // Use prepared statement to prevent SQL injection
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $language);
        $stmt->execute();
        $result = $stmt->get_result();

        // If there are results, fetch the row
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // Get response array
            $response = [
                'title' => $row['title'],
                'artist' => $row['artist'],
                'youtube_link' => $row['youtube_link'],
            ];
            // Return the response as JSON
            echo json_encode($response);
        } else {
            // If no songs are found, return an error message as JSON
            echo json_encode(['error' => 'No songs found for the selected mood and language.']);
        }
    } else {
        // If mood and language parameters aren't set, return an error message as JSON
        echo json_encode(['error' => 'Mood and language not set in the POST request.']);
    }
}

// Close the database connection
$conn->close();
?>
