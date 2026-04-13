// index.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Get prompt from query
  const { p } = req.query;

  if (!p) {
    return res.status(400).json({
      status: "error",
      message: "Missing 'p' query parameter"
    });
  }

  try {
    // Call the original API
    const response = await fetch(
      `https://sagor.nav.bd/sagor/gpt5-4?p=${encodeURIComponent(p)}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Sagor-Vercel-Proxy"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.status}`);
    }

    const data = await response.json();

    // Return the API response
    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch data from the original API",
      error: error.message
    });
  }
}
