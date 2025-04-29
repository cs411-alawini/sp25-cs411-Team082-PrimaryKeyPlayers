USE nba_db;
CREATE TABLE favorite_log(
	log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    favorite_id VARCHAR(255) NOT NULL,
    favorite_type ENUM('team','player') NOT NULL,
    action VARCHAR(50) NOT NULL,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);