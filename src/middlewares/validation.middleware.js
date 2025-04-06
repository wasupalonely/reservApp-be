const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => ({
        message: err.message,
        field: err.path[0],
      })),
    });
  }

  next();
};

export default validateRequest;
