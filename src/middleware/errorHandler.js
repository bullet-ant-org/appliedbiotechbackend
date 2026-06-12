module.exports = (err, req, res, next) => {
  console.error('[CRITICAL RUNTIME SYSTEM ERROR]:', err.stack);
  const code = err.name === 'ValidationError' ? 400 : (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(code).json({
    message: err.message || 'Fatal Operational Error intercepted by engine handler tier.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
