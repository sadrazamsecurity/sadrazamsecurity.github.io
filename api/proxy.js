export default async function (req, res) {
    // CORS Başlıklarını ekleyerek tarayıcıyı rahatlatıyoruz
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { endpoint, method, body, token } = req.body;

    try {
        const mailRes = await fetch(`https://api.mail.tm${endpoint}`, {
            method: method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/ld+json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: body ? JSON.stringify(body) : null
        });

        const data = await mailRes.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
