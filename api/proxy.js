export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { action, address, password, token } = req.query;

    let url = "";
    let options = { method: "GET", headers: {} };

    // 1️⃣ Domainleri al
    if (action === "domains") {
      url = "https://api.mail.tm/domains";
    }

    // 2️⃣ Mail oluştur
    else if (action === "create") {
      url = "https://api.mail.tm/accounts";
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, password })
      };
    }

    // 3️⃣ Token al
    else if (action === "token") {
      url = "https://api.mail.tm/token";
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, password })
      };
    }

    // 4️⃣ Inbox
    else if (action === "messages") {
      url = "https://api.mail.tm/messages";
      options.headers.Authorization = `Bearer ${token}`;
    }

    else {
      return res.status(400).json({ error: "Geçersiz action" });
    }

    const response = await fetch(url, options);
    const text = await response.text();

    // mail.tm bazen boş body döner
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error("MAIL.TM PROXY ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}

