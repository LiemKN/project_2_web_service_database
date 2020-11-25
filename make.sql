DROP DATABASE IF EXISTS code_time_capsule;
DROP USER IF EXISTS code_time_capsule_user@localhost;

CREATE DATABASE code_time_capsule CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER code_time_capsule_user@localhost IDENTIFIED BY '@Smurfy40';
GRANT ALL PRIVILEGES ON code_time_capsule.* TO code_time_capsule_user@localhost;
