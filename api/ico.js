const api = module.exports = require('express').Router();
const ICOService = require('../shared/service/ico.service');

api.post('/addToken', addToken);

api.get('/getBalance', getBalance);

api.post('/updateUserWalletAddress', updateUserWalletAddress);


function addToken(request, response, next) {
    const userId = request.body.userId;
    const amount = request.body.amount;
    ICOService.addToken(userId, amount)
        .then(() => {
            response.status(200).send({
                error: {
                    status: 'OK',
                    code: 0,
                    message: `OK`
                }
            })
        })
        .catch(err => next(err));
}

function getBalance(request, response, next) {
    const userId = request.query.userId;
    const address = request.query.address;
    ICOService.getBalance(userId)
        .then(result => {
            response.status(200).send({
                error: {
                    status: 'OK',
                    code: 0,
                    message: `OK`
                },
                balance: {
                    token: result[0],
                    ethereum: result[1]
                }
            })
        })
        .catch(err => next(err));
}

function updateUserWalletAddress(request, response, next) {
    const userId = request.body.userId;
    const walletAddress = request.body.walletAddress;
    ICOService.updateUserWalletAddress(userId, walletAddress)
        .then(() => {
            response.status(200).send({
                error: {
                    status: 'OK',
                    code: 0,
                    message: `OK`
                }
            })
        })
        .catch(err => next(err));
}