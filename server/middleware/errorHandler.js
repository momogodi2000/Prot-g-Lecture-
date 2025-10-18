export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Erreur interne du serveur';
  let code = 'INTERNAL_ERROR';

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données de validation invalides';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Non autorisé';
    code = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Accès interdit';
    code = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Ressource non trouvée';
    code = 'NOT_FOUND';
  } else if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    statusCode = 409;
    message = 'Cette ressource existe déjà';
    code = 'DUPLICATE_ENTRY';
  } else if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    statusCode = 400;
    message = 'Violation de contrainte de clé étrangère';
    code = 'FOREIGN_KEY_ERROR';
  } else if (err.message) {
    // Custom error messages
    if (err.message.includes('not found') || err.message.includes('introuvable')) {
      statusCode = 404;
      message = err.message;
      code = 'NOT_FOUND';
    } else if (err.message.includes('invalid') || err.message.includes('invalide')) {
      statusCode = 400;
      message = err.message;
      code = 'INVALID_INPUT';
    } else {
      message = err.message;
    }
  }

  // Don't expose error details in production
  const response = {
    error: message,
    code,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err;
  }

  res.status(statusCode).json(response);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée: ${req.originalUrl}`);
  error.name = 'NotFoundError';
  next(error);
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
