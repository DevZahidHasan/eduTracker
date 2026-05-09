"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const apiError_1 = require("../utils/apiError");
const errorMiddleware = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (!(err instanceof apiError_1.ApiError)) {
        statusCode = err.statusCode || 500;
        message = err.message || 'Internal Server Error';
    }
    const response = Object.assign(Object.assign({ success: false, message }, (process.env.NODE_ENV === 'development' && { stack: err.stack })), { errors: err.errors || [] });
    res.status(statusCode).json(response);
};
exports.errorMiddleware = errorMiddleware;
