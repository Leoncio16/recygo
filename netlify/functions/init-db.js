global.WebSocket = require('ws');
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const db = sql({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await db`
      CREATE TABLE IF NOT EXISTS comments (
        id serial PRIMARY KEY,
        name text NOT NULL,
        message text NOT NULL,
        image_url text,
        created_at timestamp DEFAULT now()
      )
    `;
    return {
      statusCode: 200,
      body: 'Comments table initialized.'
    };
  } catch (err) {
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
}; 