export default function error(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];

    return res.status(400).json({
      code: 11000,
      message: `${field} is already taken`,
      field,
    });
  }

  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}
