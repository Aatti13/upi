/**
 * Sends a success response with status code 200 (or custom status).
 * @param {object} res - Express response object.
 * @param {string} [message='Successful Action'] - Success message.
 * @param {object} [data={}] - Additional data to include in the response.
 * @param {number} [statusCode=200] - HTTP status code.
 * @returns {object} JSON response with success: true.
 */
export const success = (res, message='Successful Action', data={}, statusCode=200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data && { data }
  });
}

/**
 * Sends a bad request response with status code 400.
 * @param {object} res - Express response object.
 * @param {string} [message='Bad Request'] - Error message.
 * @returns {object} JSON response with success: false.
 */
export const badRequest = (res, message = 'Bad Request') => {
  return res.status(400).json({
    success: false,
    message,
  });
}

/**
 * Sends an unauthorized response with status code 401.
 * @param {object} res - Express response object.
 * @param {string} [message='Unauthorized'] - Error message.
 * @returns {object} JSON response with success: false.
 */
export const unauthorized = (res, message = 'Unauthorized')=>{
  return res.status(401).json({
    success: false,
    message,
  });
}

/**
 * Sends a not found response with status code 404.
 * @param {object} res - Express response object.
 * @param {string} [message='Not Found'] - Error message.
 * @returns {object} JSON response with success: false.
 */
export const notFound = (res, message = 'Not Found')=>{
  return res.status(404).json({
    success: false,
    message
  });
}

/**
 * Sends a conflict response with status code 409.
 * @param {object} res - Express response object.
 * @param {string} [message='Conflict'] - Error message.
 * @returns {object} JSON response with success: false.
 */
export const conflict = (res, message='Conflict')=>{
  return res.status(409).json({
    success:false,
    message
  });
}

/**
 * Sends a server error response with status code 500 (or custom status).
 * @param {object} res - Express response object.
 * @param {string} [error='Internal Server Error'] - Error message.
 * @param {number} [statusCode=500] - HTTP status code.
 * @returns {object} JSON response with success: false.
 */
export const serverError = (res, error='Internal Server Error', statusCode=500)=>{
  return res.status(statusCode).json({
    success: false,
    message: error
  });
}
