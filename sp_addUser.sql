DROP PROCEDURE IF EXISTS sp_addUser;
DELIMITER $$
CREATE PROCEDURE sp_addUser(IN usernameEntry VARCHAR(255), IN emailEntry VARCHAR(255), IN passwordEntry VARCHAR(255))
BEGIN
    DECLARE duplicate_Counts INT DEFAULT 0;
    SELECT SUM(cnt) INTO duplicate_Counts
      FROM(
		SELECT COUNT(*) AS cnt FROM users WHERE username =usernameEntry
		UNION ALL                     
		SELECT COUNT(*) FROM users WHERE email=emailEntry
        )AS tmp_;
    IF duplicate_Counts > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Username or e-mail entered already exists!';
    ELSE
		INSERT INTO users (username,email,password)
        VALUES (usernameEntry, emailEntry,passwordEntry);
        SELECT u.user_id,COALESCE(COUNT(f.favorite_id),0) AS favourite_total
		FROM users AS u
		LEFT JOIN user_favorite AS f ON f.user_id = u.user_id 
		WHERE u.username = usernameEntry
		GROUP BY u.user_id;
    END IF;
END$$
DELIMITER ;
