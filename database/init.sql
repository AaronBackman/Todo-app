CREATE DATABASE IF NOT EXISTS tododb;
CREATE TABLE IF NOT EXISTS todoTable (
      title VARCHAR(255),
      date VARCHAR(255),
      priorityname VARCHAR(255),
      priorityvalue INT(1),
      iscompleted INT(1),
      id INT(255),
      username VARCHAR(255),
      PRIMARY KEY (id, username)
      );
CREATE TABLE IF NOT EXISTS userTable (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255)
      );
