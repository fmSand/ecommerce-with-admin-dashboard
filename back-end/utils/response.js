function success(res, statuscode, result, extraData = {}) {
  return res.status(statuscode).json({
    status: "success",
    statuscode,
    data: {
      result,
      ...extraData,
    },
  });
}

function error(res, statuscode, result, extraData = {}) {
  return res.status(statuscode).json({
    status: "error",
    statuscode,
    data: {
      result,
      ...extraData,
    },
  });
}

module.exports = { success, error };
