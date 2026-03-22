// Utility to standardize API responses
const apiResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
    });
};

export default apiResponse;