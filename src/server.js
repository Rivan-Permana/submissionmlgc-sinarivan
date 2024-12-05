const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const loadModel = require("./services/modelService");
require("dotenv").config();

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: "0.0.0.0",
    routes: {
      cors: { origin: ["*"] },
    },
  });

  // Load the model and attach it to the server app
  server.app.model = await loadModel();
  if (!server.app.model) {
    console.error("Model gagal dimuat!");
    process.exit(1); // Berhenti jika model tidak dimuat
  }

  // Register routes
  server.route(routes);

  // Error handling for common response codes
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      const { statusCode } = response.output;

      // Pesan error spesifik
      if (statusCode === 413) {
        const newResponse = h
          .response({
            status: "fail",
            message:
              "Payload content length greater than maximum allowed: 1000000",
          })
          .code(413);
        return newResponse;
      }

      if (statusCode === 404) {
        const newResponse = h
          .response({
            status: "fail",
            message: "Not Found",
          })
          .code(404);
        return newResponse;
      }

      // Default handling untuk error lain
      const newResponse = h
        .response({
          status: "fail",
          message: response.message,
        })
        .code(statusCode);

      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
})();
