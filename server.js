const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const port = process.env.PORT | 3000;
const app = express();

let allowCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.engine('html', require('ejs').renderFile);
// static files
app.use(express.static(__dirname + '/public'));
// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(allowCORS);
// route files
app.use('/auth', require('./routes/auth'));
app.use('/data', require('./routes/data'));

// create http server
http.createServer(app).listen(port, () => {
    console.log(`Server listening at port ${port}`);
})

app.get('/', (req, res) => {
    res.render('auth.html');
})
app.get('*', (req, res) => {
    res.end(JSON.stringify({ 'error': 'trying to access non-resource file' }))
});

/*
SERVER LISTENING FOR REQUESTS
*/
app.listen = () => {
    const server = http.createServer(this);
    return server.listen.apply(server, arguments);
}