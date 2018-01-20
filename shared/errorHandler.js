exports.getErrorObject = (error) => {
    const errorObject = {
        httpCode: 500,
        status: 'ERROR',
        message: error.message || error
    }
    if (error instanceof Error) {
        switch (errorObject.message) {
            case 'INVALID_REQUEST':
                errorObject.httpCode = 400;
                break;
        }
    } else {

    }
    return errorObject;
}