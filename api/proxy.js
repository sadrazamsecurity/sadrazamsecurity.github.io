export default async function handler(req, res) {
    // CORS Başlıkları (Tarayıcı engeline karşı)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Tarayıcı bazen ön kontrol (OPTIONS) yapar, ona onay veriyoruz
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { endpoint, method, body, token } = req.body;

    try {
        // Mail.tm'e giden asıl istek
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
        // Hata olursa loglara yazdırıyoruz
        console.error("Proxy Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
          }
