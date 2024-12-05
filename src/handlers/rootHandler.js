const testHandler = (request, h) => {
  return h
    .response({
      status: "success",
      message: "API connected successfully",
    })
    .code(200);
};

module.exports = { testHandler };
