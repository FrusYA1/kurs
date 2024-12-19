CREATE DATABASE messenger;

USE messenger;

CREATE TABLE users ( 
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(256) NOT NULL UNIQUE,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128),
    password VARCHAR(40) NOT NULL,
    creation_date DATETIME NOT NULL
);

CREATE TABLE chats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL, 
    name VARCHAR(256) NOT NULL,
    creation_date DATETIME NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    send_time DATETIME NOT NULL
);

CREATE TABLE chat_message (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    chat_id INT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id), 
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE TABLE user_message (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id), 
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE TABLE blacklist (
    user_id INT NOT NULL,
    blocked_user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (blocked_user_id) REFERENCES users(id)
);

CREATE TABLE chat_user (
    user_id INT NOT NULL,
    chat_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    UNIQUE (user_id, chat_id)
);

delimiter //
CREATE TRIGGER users_insert_trigger BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.password = md5(CONCAT(NEW.password, 'c5262e'));
    SET NEW.creation_date = NOW();
END;//
delimiter ;

delimiter //
CREATE TRIGGER users_update_trigger BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.password = md5(CONCAT(NEW.password, 'c5262e'));
END;//
delimiter ;

delimiter //
CREATE TRIGGER message_trigger BEFORE INSERT ON messages
FOR EACH ROW
BEGIN
    SET NEW.send_time = NOW();
END;//
delimiter ;

delimiter //
CREATE TRIGGER chat_trigger BEFORE INSERT ON chats
FOR EACH ROW
BEGIN
    SET NEW.creation_date = NOW();
END;//
delimiter ;

INSERT INTO users (email, firstname, lastname, password) VALUES
('john.doe@example.com', 'John', 'Doe', 'password1'),
('mary.smith@example.com', 'Mary', 'Smith', 'password2'),
('edward.yates@example.com', 'Edward', 'Yates', 'password3'),
('anne.marston@example.com', 'Anne', 'Marston', 'password4'),
('chris.johnson@example.com', 'Chris', 'Johnson', 'password5'),
('nancy.miller@example.com', 'Nancy', 'Miller', 'password6'),
('samuel.williams@example.com', 'Samuel', 'Williams', 'password7'),
('kelly.west@example.com', 'Kelly', 'West', 'password8'),
('arthur.morgan@example.com', 'Artur', 'Morgan', 'password9'),
('samantha.reyes@example.com', 'Samantha', 'Reyes', 'password10');

INSERT INTO chats (admin_id, name) VALUES
(1, 'Чат 1'),
(2, 'Чат 2'),
(3, 'Чат 3');

INSERT INTO chat_user (user_id, chat_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(2, 2),
(3, 2),
(6, 2),
(7, 2),
(3, 3),
(8, 3),
(9, 3),
(10, 3);
