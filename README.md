# Refill Comment Section

This project includes a fully functional comment section with a frontend (HTML/CSS/JS) and a backend using Netlify Functions connected to a Neon-hosted PostgreSQL database.

## Features
- Users can submit comments with name, message, and optional image
- Comments are stored in a PostgreSQL database (Neon)
- Images are stored as data URLs (for demo purposes)
- Comments are fetched and displayed dynamically
- Inputs are sanitized and message length is limited
- Responsive, clean UI

## Setup

### 1. Neon Database
- Create a PostgreSQL database on [Neon](https://neon.tech/)
- Copy the connection string (e.g., `postgres://...`)

### 2. Netlify Environment Variable
- Set the environment variable `NETLIFY_DATABASE_URL` to your Neon connection string in your Netlify site settings

### 3. Install Dependencies for Functions
```
cd netlify/functions
npm install
```

### 4. Initialize the Database Table
- Deploy to Netlify or run locally with Netlify CLI
- Make a POST request to `/.netlify/functions/init-db` to create the `comments` table

### 5. Deploy
- Deploy the site to Netlify
- The comment section will work automatically

## Endpoints
- `/.netlify/functions/post-comment` (POST): Add a comment
- `/.netlify/functions/get-comments` (GET): Fetch all comments

## Security Notes
- Inputs are sanitized to prevent XSS
- Message length is limited to 1000 characters
- For production, consider using an external image hosting service instead of storing images as data URLs

## Styling
- Custom CSS for form and comment list
- Responsive for mobile and desktop

--- 