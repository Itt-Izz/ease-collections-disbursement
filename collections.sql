-- select all
SELECT 
    *
FROM
    collections;
    
DELETE FROM collections 
WHERE
    id > 0;

-- select count total by region for today only
SELECT 
    SUM(c.cl_amount) AS amount,
    r.region_name,
    m.merch_code,
    GROUP_CONCAT(CONCAT(TIME(c.server_time))
        ORDER BY server_time DESC) time
FROM
    collections c
        LEFT JOIN
    merchants m ON c.cl_merch_id = m.merch_code
        RIGHT JOIN
    regions r ON m.region_code = r.id
WHERE
    c.server_date = CURDATE()
GROUP BY region_name , merch_code;


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
    SUM(c.cl_amount) amount, cn.constituency_name
FROM
    constituencies cn
        INNER JOIN
    regions r ON r.constituency_code = cn.id
        INNER JOIN
    merchants m ON m.region_code = r.id
        INNER JOIN
    collections c ON c.cl_merch_id = m.merch_code
WHERE
    c.server_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY constituency_name
ORDER BY amount DESC
LIMIT 1;

-- select and group totals by date for specific past days
SELECT 
    MONTH(server_time) month, SUM(cl_amount) amount
FROM
    collections
WHERE
    DATE(server_time) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY MONTH(server_time);











