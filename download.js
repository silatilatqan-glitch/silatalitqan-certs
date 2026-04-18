export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }

  // Only allow Cloudinary URLs
  if (!url.includes('cloudinary.com')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch' });
    }

    const buffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.send(Buffer.from(buffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
