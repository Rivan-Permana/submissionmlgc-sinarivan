const tf = require("@tensorflow/tfjs-node");

const predictClassification = async (model, image) => {
  if (!model) {
    throw new Error("Model TensorFlow tidak dimuat");
  }

  if (!image) {
    throw new Error("Input gambar tidak valid");
  }

  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();

  const prediction = model.predict(tensor);

  console.log("Prediction shape:", prediction.shape);
  console.log("Prediction data:", await prediction.data());

  const score = await prediction.data();
  const confidenceScore = Math.max(...score) * 100;

  const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

  const suggestions = [
    "Penyakit kanker tidak terdeteksi.",
    "Segera periksa ke dokter!",
  ];
  const suggestion = suggestions[confidenceScore > 50 ? 1 : 0];

  return { confidenceScore, label, suggestion };
};

module.exports = predictClassification;
