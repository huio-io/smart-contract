const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const web3Service = require('./shared/service/web3.service');

app.set('port', 3000);

app.use([express.json(), express.urlencoded({
    extended: false
})]);

app.use('*', (request, response, next) => {
    const clientIP = request.ip || request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress || request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    if (false) {
        response.status(401).send({
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


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

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


app.listen(app.get('port'), () => {
    console.log('ICO service listening on port ' + app.get('port'));
});