// server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8021;
// פתרון בעיית ה cors
app.use(cors());
app.use(express.json());

const { BigQuery } = require("@google-cloud/bigquery");
//צריך להוסיף את ניתוב לקובץ ההרשאות
const bigquery = new BigQuery({
    keyFilename: "./config/key.json"
});
const nameDB = "platform-hackaton-2025";
module.exports = { bigquery, nameDB };

const clicksRouter = require("./routes/clicksRoutes");
const impressionsRouter = require("./routes/impressionsRoutes");

app.use("/impressions", impressionsRouter);
app.use("/clicks", clicksRouter);

// לצורך דוגמה 
app.get('/user', (req, res) => {
  res.json({ name: 'John Doe' });
});
app.get('/', (req, res) => {
  console.log("helll");
  res.send("hhhhhh")
  ;
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
