const api = module.exports = require('express').Router();
const ICOService = require('../shared/service/ico.service');
const Web3Service = require('../shared/service/web3.service');

api.post('/addToken', containsValidAddress, addToken);

api.get('/getBalance', containsValidAddress, getBalance);

api.post('/updateUserWalletAddress', updateUserWalletAddress);

api.post('/updateConfigContract', updateConfigContract);

function containsValidAddress(request, response, next) {
    if ((request.method === 'POST' && request.body.userAddress && Web3Service.isAddress(request.body.userAddress)) ||
        (request.method === 'GET' && request.query.userAddress && Web3Service.isAddress(request.query.userAddress))
    ) {
        next();
    } else {
        response.status(400).send({
            error: {
                status: 'INVALID_ADDRESS',
                code: 1,
                message: `Invalid address!`
            }
        });
    }
}

function addToken(request, response, next) {
    const userAddress = request.body.userAddress;
    const amount = request.body.amount;
    ICOService.addToken(userAddress, amount)
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
    const userAddress = request.query.userAddress;
    const address = request.query.address;
    ICOService.getBalance(userAddress)
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
    const userAddress = request.body.userAddress;
    const walletAddress = request.body.walletAddress;
    ICOService.updateUserWalletAddress(userAddress, walletAddress)
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

function updateConfigContract(request, response, next) {
    const {
        supply,
        ownership,
        addressMigration,
        startTime,
        endTime
    } = request.body;
    ICOService.updateConfigContract(supply, ownership, addressMigration,
            startTime, endTime)
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