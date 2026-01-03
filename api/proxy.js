export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { action } = req.query;

    let url = "";
    let options = {
      method: "GET",
      headers: {
        "Accept": "application/ld+json"
      }
    };

    // 1️⃣ Domain listesi
    if (action === "domains") {
      url = "https://api.mail.tm/domains";
    }

    // 2️⃣ Mail oluştur
    else if (action === "create") {
      const { address, password } = req.query;

      url = "https://api.mail.tm/accounts";
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/ld+json"
        },
        body: JSON.stringify({ address, password })
      };
    }

    // 3️⃣ Token al
    else if (action === "token") {
      const { address, password } = req.query;

      url = "https://api.mail.tm/token";
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ address, password })
      };
    }

    // 4️⃣ Inbox
    else if (action === "messages") {
      const { token } = req.query;

      url = "https://api.mail.tm/messages";
      options.headers.Authorization = `Bearer ${token}`;
    }

    // 5️⃣ Tek mail içeriği
    else if (action === "message") {
      const { token, id } = req.query;

      url = `https://api.mail.tm/messages/${id}`;
      options.headers.Authorization = `Bearer ${token}`;
    }

    else {
      return res.status(400).json({ error: "Geçersiz action" });
    }

    const response = await fetch(url, options);
    const text = await response.text();

    // JSON-LD + JSON güvenli parse
    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch {
      return res.status(response.status).send(text);
    }

  } catch (err) {
    console.error("MAIL.TM PROXY ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
 }
