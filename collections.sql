-- select all
SELECT 
    *
FROM
    collections
WHERE
    DATE(server_date) = CURDATE();

-- select count total by region for today only
SELECT 
    SUM(c.cl_amount) AS amount,
    DATE(c.server_date) AS col_date,
    r.region_name
FROM
    collections c
        LEFT JOIN
    merchants m ON c.cl_merch_id = m.merch_code
        RIGHT JOIN
    regions r ON m.region_code = r.id
WHERE
    c.server_date = CURDATE()
GROUP BY region_name , col_date;


-- SELECT COUNT BY PHONE
SELECT 
    phone, COUNT(cl_amount),id_number
FROM
    (SELECT 
        clients.first_name,
            clients.last_name,
            clients.id_number,
            clients.phone,
            cl.cl_amount,
            cl.server_date
    FROM
        collections AS cl
    RIGHT JOIN clients ON clients.id = cl.cl_code
    WHERE
        phone = '+254720421336') AS c
GROUP BY phone,id_number;

-- selecting by constituencies / sub-counties
SELECT 
    SUM(c.cl_amount) AS amount,
    DATE(c.server_date) AS col_date,
    cn.constituency_name
FROM
    constituencies cn
        INNER JOIN
    regions r ON r.constituency_code = cn.id
        INNER JOIN
    merchants m ON m.region_code = r.id
        INNER JOIN
    collections c ON c.cl_merch_id = m.merch_code
WHERE
    c.server_date = CURDATE()
GROUP BY constituency_name , col_date;

-- select and group totals by date for specific past days
SELECT 
    MONTH(server_time) month, SUM(cl_amount) amount
FROM
    collections
WHERE
    DATE(server_time) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY MONTH(server_time);











