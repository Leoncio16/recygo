global.WebSocket = require('ws');
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { name, message, image_base64 } = JSON.parse(event.body || '{}');
    if (!name || !message) {
      return { statusCode: 400, body: 'Name and message are required.' };
    }
    let image_url = null;
    if (image_base64 && image_base64.startsWith('data:image/')) {
      image_url = image_base64.slice(0, 200000);
    }
    const result = await pool.query(
      'INSERT INTO comments (name, message, image_url) VALUES ($1, $2, $3) RETURNING id',
      [name, message, image_url]
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result.rows[0]?.id })
    };
  } catch (err) {
    console.error('DB error:', err);
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
};