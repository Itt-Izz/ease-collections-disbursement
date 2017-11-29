create database if not exists county_ps_;
USE county_ps_;

CREATE TABLE admin (
    id INT AUTO_INCREMENT,
    code NVARCHAR(40),
    password NVARCHAR(200),
    PRIMARY KEY (id)
);

CREATE TABLE county (
    id INT AUTO_INCREMENT,
    county_name NVARCHAR(40),
    PRIMARY KEY (id)
);
-- drop table county

CREATE TABLE constituencies (
    id INT AUTO_INCREMENT,
    constituency_name NVARCHAR(40),
    county_code INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_county_id FOREIGN KEY (county_code)
        REFERENCES county (id)
);
-- insert into constituencies(county_code,constituency_name) values('1','Kigumo'),('1','Kiharu');
-- drop table constituencies

CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT,
    region_name NVARCHAR(50),
    constituency_code INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_const_id FOREIGN KEY (constituency_code)
        REFERENCES constituencies (id)
        ON DELETE CASCADE
);
-- insert into regions(region_name,constituency_code) values('Makomboki','1'),('Mununga','1'),('Kigumo','1'),('Kiharu Town','2');
-- drop table regions

CREATE TABLE merchants (
    id INT AUTO_INCREMENT,
    merch_code NVARCHAR(15),
    merch_fname NVARCHAR(20),
    merch_lname NVARCHAR(20),
    merch_phone NVARCHAR(15),
    merch_email NVARCHAR(60),
    merch_secret NVARCHAR(255),
    merch_password NVARCHAR(255),
    region_code INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_reg_code FOREIGN KEY (region_code)
        REFERENCES regions (id)
        ON DELETE CASCADE
);
-- drop table merchants
alter table merchants add index merch_code(merch_code);

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT,
    first_name NVARCHAR(30),
    last_name NVARCHAR(30),
    email NVARCHAR(30),
    id_number NVARCHAR(40),
    phone NVARCHAR(15),
    auth_code NVARCHAR(20),
    alt_phone NVARCHAR(15),
    region_code INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_region_code FOREIGN KEY (region_code)
        REFERENCES regions (id)
        ON DELETE CASCADE
);

-- alter table clients add column date_joined date null after alt_phone
-- drop table clients;

CREATE TABLE IF NOT EXISTS collections (
    id INT AUTO_INCREMENT,
    cl_code INT,
    cl_phone NVARCHAR(15),
    cl_amount DECIMAL(4 , 2 ),
    cl_time NVARCHAR(12),
    cl_merch_id NVARCHAR(15),
    server_date DATE NULL,
    server_time TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cl_code FOREIGN KEY (cl_code)
        REFERENCES clients (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_merchant_code FOREIGN KEY (cl_merch_id)
        REFERENCES merchants (merch_code)
        ON DELETE CASCADE
);
-- drop table collections        

/*
 trigger to update date column,(pick date of the server to ensure data integrity)
*/
DELIMITER $$
create trigger cur_date_update before insert on collections for each row
if(isnull(new.server_date)) then
	set new.server_date=curdate();
end if;
$$
DELIMITER ;

DELIMITER $$
create trigger date_joined_update before insert on clients for each row
if(isnull(new.date_joined)) then
	set new.date_joined=curdate();
end if;
$$
DELIMITER ;

-- create table to hold notifications
CREATE TABLE IF NOT EXISTS notifs (
    id INT AUTO_INCREMENT,
    notif_type ENUM('ERROR', 'MESSAGE', 'HELP'),
    info NVARCHAR(200),
    date DATETIME DEFAULT NOW(),
    m_code INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_m_code FOREIGN KEY (m_code)
        REFERENCES merchants (id)
);
alter table notifs add column status int default 0;

















