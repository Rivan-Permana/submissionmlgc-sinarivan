const {
  postPredictHandler,
  getHistoriesHandler,
} = require("../handlers/predictionHandler");

const predictionRoutes = [
  {
    method: "POST",
    path: "/predict",
    handler: postPredictHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "data", // Memproses file sebagai buffer
        parse: "true",
        maxBytes: 1000000, // Batas ukuran file 1MB
      },
    },
  },
  {
    method: "GET",
    path: "/predict/histories",
    handler: getHistoriesHandler,
  },
];

module.exports = predictionRoutes;
