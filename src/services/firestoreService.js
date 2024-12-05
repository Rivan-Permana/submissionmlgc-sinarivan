const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();
const predictCollection = db.collection("predictions");

const storeData = async ({ id, label, suggestion, createdAt }) => {
  // Sesuai kriteria: Hanya memastikan field ada dan strukturnya benar
  const data = { id, result: label, suggestion, createdAt };

  await predictCollection.doc(id).set(data); // Menyimpan dokumen
  console.log(`Data dengan id: ${id} berhasil disimpan.`);
};

const fetchHistories = async () => {
  try {
    const allData = await predictCollection.get();
    if (allData.empty) {
      console.log("No prediction histories found.");
      return [];
    }

    // Format data sesuai dengan struktur kriteria
    return allData.docs.map((doc) => {
      const { id, result, suggestion, createdAt } = doc.data();
      return {
        id, // ID untuk dokumen root
        history: {
          // History sesuai format
          id,
          result,
          suggestion,
          createdAt,
        },
      };
    });
  } catch (error) {
    console.error("Error fetching histories:", error.message);
    throw error;
  }
};

module.exports = { storeData, fetchHistories };
