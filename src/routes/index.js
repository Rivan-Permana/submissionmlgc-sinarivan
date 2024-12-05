const predictionRoutes = require("./predictionRoutes");
const { testHandler } = require("../handlers/rootHandler");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: testHandler,
  },
  ...predictionRoutes,
];

module.exports = routes;
