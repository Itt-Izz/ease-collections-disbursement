// We need this to build our post string

let querystring = require('querystring');
let https = require('https');
let username = 'danny';
let apikey = 'e1fa9c6dea495228dfa3a1d3abcb02de63ee84b32ab332961bd4a137b3d3afe5';

exports.sendMessage = (dest, msg, c) => {
    let to = dest;
    let message = msg;

    let post_data = querystring.stringify({
        'username': username,
        'to': to,
        'message': message
    });

    let post_options = {
        host: 'api.africastalking.com',
        path: '/version1/messaging',
        method: 'POST',

        rejectUnauthorized: false,
        requestCert: true,
        agent: false,

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Accept': 'application/json',
            'apikey': apikey
        }
    };

    let _req = https.request(post_options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (response) => {
            let jsObject = JSON.parse(response);
            let recipients = jsObject.SMSMessageData.Recipients;
            let rsp = [];
            if (recipients.length > 0) {
                for (let i = 0; i < recipients.length; ++i) {
                    rsp.push({
                        'number': recipients[i].number,
                        'cost': recipients[i].cost,
                        'status': recipients[i].status
                    })
                }
                return c(rsp);
            } else {
                while (rsp.length > 0) {
                    rsp.pop();
                }
                rsp.push({ 'error': jsObject.SMSMessageData.Message })
                return c(rsp);
            }
        });
    }).on('error', (err) => {
        return c(err);
    });

    _req.write(post_data);
    _req.end();
}