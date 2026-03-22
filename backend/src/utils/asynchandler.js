// Utility to handle asynchronous operations and catch errors
const asyncHandler = (fn) =>{ return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}
};

export default asyncHandler;