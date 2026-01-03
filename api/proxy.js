export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const action = req.query.action;
    if (!action) {
      return res.status(400).json({ error: "action missing" });
    }

    let url = "";
    let options = { method: "GET", headers: {} };

    // 1️⃣ DOMAINLER
    if (action === "domains") {
      url = "https://api.mail.tm/domains";
    }

    // 2️⃣ HESAP OLUŞTUR
    else if (action === "create") {
      const { address, password } = req.query;
      if (!address || !password) {
        return res.status(400).json({ error: "address or password missing" });
      }

      url = "https://api.mail.tm/accounts";
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify({ address, password });
    }

    // 3️⃣ TOKEN AL
    else if (action === "token") {
      const { address, password } = req.query;
      if (!address || !password) {
        return res.status(400).json({ error: "address or password missing" });
      }

      url = "https://api.mail.tm/token";
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify({ address, password });
    }

    // 4️⃣ MAİLLER
    else if (action === "messages") {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ error: "token missing" });
      }

      url = "https://api.mail.tm/messages";
      options.headers.Authorization = `Bearer ${token}`;
    }

    // 5️⃣ TEK MAİL
    else if (action === "message") {
      const { token, id } = req.query;
      if (!token || !id) {
        return res.status(400).json({ error: "token or id missing" });
      }

      url = `https://api.mail.tm/messages/${id}`;
      options.headers.Authorization = `Bearer ${token}`;
    }

    else {
      return res.status(400).json({ error: "invalid action" });
    }

    const response = await fetch(url, options);
    const text = await response.text();

    try {
      return res.status(response.status).json(JSON.parse(text));
    } catch {
      return res.status(response.status).send(text);
    }

  } catch (err) {
    console.error("PROXY ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
                                   }
