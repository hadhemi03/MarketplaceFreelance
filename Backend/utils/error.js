export const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
}  

// instead of each error we write error ( status : ..... , message : .....)
// we just call the createError : createError(401, "message")