const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, method, body, token } = req.body;

  try {
    const response = await fetch(`https://api.mail.tm${endpoint}`, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/ld+json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: body ? JSON.stringify(body) : null
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
