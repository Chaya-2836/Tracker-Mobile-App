// server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());


app.use(express.json());

app.get('/user', (req, res) => {
  res.json({ name: 'John Doe' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
