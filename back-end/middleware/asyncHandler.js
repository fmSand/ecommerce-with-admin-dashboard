//handles async function errors and passes them to the error handling middleware
//from productivity graveyard project
function asyncHandler(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncHandler;
