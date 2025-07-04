export const successResponse = (res, statusCode=201, message='Success', data=null, meta=null) => {
  const response = {
    success: true,
    message,
    ...(data && {data}),
    ...(meta && {meta})
  };

  return res.status(statusCode).json(response);
}

export const handleServerError = (res, statusCode=500, message='Internal Server Error', error=null) => {
  const response = {
    success: false,
    message,
    ...(error && process.env.NODE_ENV==="development" && {error})
  };

  return res.status(statusCode).json(response);
}

export const sendValidationError = (res, message='Validation Error', errors = []) => {
  const response = {
    success: false,
    message,
    errors
  };

  return res.status(400).json(response);
}

export const sendUnauthorizedResponse = (res, message='Unauthorized') => {
  const response = {
    success: false,
    message
  }

  return res.status(401).json(response);
}

export const sendForbiddenResponse = (res, message='Access Denied! Forbidden!') => {
  const response = {
    success: false,
    message
  }

  return res.status(403).json(response);
}

export const sendNotFoundResponse = (res, message='Not Found') => {
  return res.status(404).json({
    success: false,
    message
  });
}

export const sendConflictingResponse = (res, message='Resource Conflict') => {
  return res.status(409).json({
    success: false,
    message
  });
}