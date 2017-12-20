const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT | 3000
const app = express()
const session = require('./utils/session')

app.engine('html', require('ejs').renderFile)
    // static files
app.use(express.static(__dirname + '/public'))
    // middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
    next()
})

// route files
app.use('/auth', require('./routes/auth'))
app.use('/data', require('./routes/data'))
app.use('/admin/auth', require('./routes/admin_auth'))
app.use('/admin/data', require('./routes/admin_data'))

// create http server
http.createServer(app).listen(port, () => {
    console.log(`Server listening at port ${port}`)
})


app.get('/', (req, res) => {
    if (session.own.find(obj => obj.ipAddrr === req.ip)) {
        res.redirect('/auth/dashboard')
    } else {
        res.render('auth.html')
    }
})

app.get('/admin', (req, res) => {
    if (session.own.find(obj => obj.aIpAddrr === req.ip)) {
        res.redirect('/admin/auth/dashboard')
    } else {
        res.render('admin/auth.html')
    }
});

app.get('*', (req, res) => {
    res.render('error.html')
});

/*
SERVER LISTENING FOR REQUESTS
*/
app.listen = () => {
    const server = http.createServer(this)
    return server.listen.apply(server, arguments)
}