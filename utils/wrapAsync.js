module.exports = (fn) => {
  return function (req, res, next) {
    // Check if fn returns a promise (async function)
    const result = fn(req, res, next);
    if (result instanceof Promise) {
      result.catch(next);  // Handle rejected promises
    }
  };
};

