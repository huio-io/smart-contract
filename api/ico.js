var api = module.exports = require('express').Router();

api.get('/test', test);

function test(request, response, next) {
    response.status(200).send({
        error: {
            status: 'OK',
            code: 0,
            message: `Received request from ${request.huio.clientIP}`
        }
    })
}