export default async function handler(req, res) {
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
}
