const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

// Runtime environment file
app.get('/env.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send(`
    window._env_ = {
      REACT_APP_BACKEND_URL: "${process.env.REACT_APP_BACKEND_URL}"
    };
  `);
});

// REACT FALLBACK (IMPORTANT FIX)
// This works with ALL Express versions.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Frontend running on port", PORT));