export default async function handler(req, res) {
    // CORS Başlıkları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // OPTIONS isteğine (ön kontrol) hızlı yanıt
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { endpoint, method, body, token } = req.body;

    try {
        // Vercel'in kendi dahili fetch'ini kullanıyoruz (Kütüphane istemez)
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
        res.status(500).json({ error: "Sunucu Hatası: " + error.message });
    }
}
