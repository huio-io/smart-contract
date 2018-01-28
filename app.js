const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const ErrorHandler = require('./shared/errorHandler');

fs.existsSync('./local.js') ? require('./local').setUpGlobalVariables() : console.log('Local setting is not found.');

console.log('Setting up web3.');
const web3Service = require('./shared/service/web3.service');
console.log(web3Service.isWeb3Connected() ? 'Web3 ok' : 'Web3 failed');

app.set('port', process.env.PORT || 3000);

app.use([express.json(), express.urlencoded({
    extended: false
})]);

app.use((request, response, next) => {
    const clientIP = request.ip || request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress || request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    // White-list ip address.
    if (false) {
        return response.status(401).send({
            error: {
                status: 'INVALID_REQUEST',
                code: 0,
                message: 'Unauthorized'
            }
        });
    }

    request.huio = {
        clientIP,
        userAgent: request.headers['user-agent']
    }

    next();
})

let apiName = '';

try {
    fs.readdirSync(path.join(__dirname, './api'))
        .forEach(fileName => {
            if (fileName.indexOf('.js') >= 0) {
                apiName = fileName.substr(0, fileName.indexOf('.'));
                app.use('/api/' + apiName, require('./api/' + apiName));
                console.log('Registered API ' + apiName);
            }
        });
} catch (exception) {
    console.log(exception);
}

app.use((error, request, response, next) => {
    // Error handler
    console.log(error);
    const errorObject = ErrorHandler.getErrorObject(error);
    response.status(errorObject.httpCode).send({
        error: {
            status: errorObject.status,
            code: 1,
            message: errorObject.message
        }
    });
})

app.listen(app.get('port'), () => {
    console.log('ICO service listening on port ' + app.get('port'));
});