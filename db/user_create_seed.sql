-- It may be helpful to drop and reinstantilize the table when doing
-- the tests in case you delete users/cars the tests are expecting to see
DROP TABLE IF EXISTS vehicles, users;

CREATE TABLE users (
  id SERIAL primary key,
  firstname varchar(40),
  lastname varchar(40),
  email varchar(255)
);

INSERT INTO users ( firstname, lastname, email)
VALUES ( 'John', 'Smith', 'John@Smith.com'),
( 'Dave', 'Davis', 'Dave@Davis.com'),
( 'Jane', 'Janis', 'Jane@Janis.com');
