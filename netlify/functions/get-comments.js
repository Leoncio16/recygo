global.WebSocket = require('ws');
console.log('DB URL:', process.env.NETLIFY_DATABASE_URL);
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, name, message, image_url, created_at FROM comments ORDER BY created_at DESC LIMIT 100'
    );
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows)
    };
  } catch (err) {
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
};