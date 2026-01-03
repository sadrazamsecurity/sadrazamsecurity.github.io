export default async function handler(req, res) {
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
    let options = {
      method: "GET",
      headers: {}
    };

    // DOMAINS
    if (action === "domains") {
      url = "https://api.mail.tm/domains";
    }

    // CREATE ACCOUNT
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

    // TOKEN
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

    // GET MESSAGES
    else if (action === "messages") {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ error: "token missing" });
      }

      url = "https://api.mail.tm/messages";
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    // GET MESSAGE BY ID
    else if (action === "message") {
      const { token, id } = req.query;
      if (!token || !id) {
        return res.status(400).json({ error: "token or id missing" });
      }

      url = `https://api.mail.tm/messages/${id}`;
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    else {
      return res.status(400).json({ error: "invalid action" });
    }

    const response = await fetch(url, options);
    const text = await response.text();

    // mail.tm bazen boş body döndürür
    if (!text || text.trim() === "") {
      return res.status(response.status).json({ success: true });
    }

    // JSON ise parse et, değilse olduğu gibi dön
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch {
      return res.status(response.status).send(text);
    }

  } catch (err) {
    console.error("PROXY ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

