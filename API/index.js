// api/index.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Allow Base64 image uploads
    }
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔹 Chat API
  if (req.method === "GET") {
    const { p } = req.query;

    if (!p) {
      return res.status(400).json({
        status: "error",
        message: "Missing 'p' query parameter"
      });
    }

    try {
      const response = await fetch(
        `https://sagor.nav.bd/sagor/gpt5-4?p=${encodeURIComponent(p)}`
      );

      if (!response.ok) {
        throw new Error(`Upstream error: ${response.status}`);
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch data from the original API"
      });
    }
  }

  // 🔹 Image Upload API (Base64)
  if (req.method === "POST") {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        status: "error",
        message: "No image provided"
      });
    }

    // Return the Base64 image directly
    return res.status(200).json({
      status: "success",
      imageUrl: image
    });
  }

  return res.status(405).json({
    status: "error",
    message: "Method not allowed"
  });
}
