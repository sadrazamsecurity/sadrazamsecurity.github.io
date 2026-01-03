export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      error: "email parametresi gerekli"
    });
  }

  try {
    const response = await fetch(
      `http://t-email.org/api/v1/emails?email=${encodeURIComponent(email)}&limit=20`
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "TEmail servisine ulaşılamadı"
      });
    }

    const data = await response.json();

    // Cache kapat (inbox anlık olsun)
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
