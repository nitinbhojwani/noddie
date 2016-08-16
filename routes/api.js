var express = require('express');
var router = express.Router();

router.post('/check-code', function(req, res, next) {
    var querystring = require('querystring');
    var http = require('http');

    source = req.body.source;
    lang = req.body.lang;
    input = req.body.input;
    api_key = req.body.api_key;

    var data = querystring.stringify({
        "source": source,
        "lang": lang,
        "testcases": JSON.stringify([input]),
        "api_key": api_key
    });

    console.log(data);

    var options = {
        host: 'api.hackerrank.com',
        port: 80,
        path: '/checker/submission.json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var request = http.request(options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                console.log("body: " + chunk);
                res.send(chunk);
            });
        },
        function(error) {
            console.log(error);
            res.send(error);
        });
    request.write(data);
    request.end();
});

module.exports = router;