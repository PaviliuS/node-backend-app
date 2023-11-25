create table person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255)
);


create table post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
); 

CREATE TABLE userList
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    UNIQUE(username),
    FOREIGN KEY (role_id) REFERENCES roleList (id)
);

CREATE TABLE roleList
(
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL
);