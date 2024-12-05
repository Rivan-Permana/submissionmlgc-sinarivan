const crypto = require("crypto");
const predictClassification = require("../services/inferenceService");
const { storeData, fetchHistories } = require("../services/firestoreService");

const postPredictHandler = async (request, h) => {
  const { image } = request.payload;

  if (!image) {
    return h
      .response({
        status: "fail",
        message: "Gambar tidak ditemukan dalam permintaan",
      })
      .code(400);
  }

  if (Buffer.byteLength(image) > 1000000) {
    return h
      .response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      })
      .code(413);
  }

  try {
    const { model } = request.server.app;
    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    );

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await storeData({ id, label, suggestion, createdAt });

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data,
      })
      .code(201);
  } catch (error) {
    console.error("Prediction error:", error);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
};

const getHistoriesHandler = async (request, h) => {
  try {
    // Ambil data yang sudah diformat dari fetchHistories
    const formattedHistories = await fetchHistories();

    // Kembalikan response dengan struktur sesuai kriteria
    return h
      .response({
        status: "success",
        data: formattedHistories, // Langsung gunakan hasil fetchHistories
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching histories:", error.message);
    return h
      .response({
        status: "fail",
        message: "Failed to fetch prediction histories",
      })
      .code(500);
  }
};

module.exports = { postPredictHandler, getHistoriesHandler };
