export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ÖRNEK: frontend ?url= şeklinde API gönderir
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({
        error: "url parametresi eksik"
      });
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Hedef API hata verdi",
        status: response.status,
        body: text
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("PROXY ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
 
