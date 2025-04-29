CREATE TABLE IF NOT EXISTS cal_favorite_log(
	log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    favorite_id VARCHAR(255) NOT NULL,
    favorite_type ENUM('team', 'player') NOT NULL,
    action VARCHAR(50) DEFAULT 'Added',
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS trigger_after_add_favorite;
DELIMITER //
CREATE TRIGGER trigger_after_add_favorite
AFTER INSERT ON user_favorite
FOR EACH ROW
BEGIN
	INSERT cal_favorite_log(user_id, favorite_id, favorite_type)
    VALUES(NEW.user_id, NEW.favorite_id, NEW.favorite_type);
END //
DELIMITER ;