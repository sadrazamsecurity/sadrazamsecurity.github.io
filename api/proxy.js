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

    // Body (POST için)
    let body = {};
    if (req.method === "POST") {
      body = req.body || {};
    }

    // DOMAINS
    if (action === "domains") {
      url = "https://api.mail.tm/domains";
    }

    // CREATE ACCOUNT
    else if (action === "create") {
      url = "https://api.mail.tm/accounts";
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    // TOKEN
    else if (action === "token") {
      url = "https://api.mail.tm/token";
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    // MESSAGES
    else if (action === "messages") {
      const token = req.query.token;
      if (!token) return res.status(400).json({ error: "token missing" });

      url = "https://api.mail.tm/messages";
      options.headers.Authorization = `Bearer ${token}`;
    }

    // SINGLE MESSAGE
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

    const r = await fetch(url, options);
    const text = await r.text();

    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).send(text);
    }

  } catch (err) {
    console.error("PROXY ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
    }
