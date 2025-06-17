const express = require('express');
const app = express();
const port = 3000;

const { BigQuery } = require("@google-cloud/bigquery");
//צריך להוסיף את ניתוב לקובץ ההרשאות
const bigquery = new BigQuery({
    keyFilename: ""
});
const nameDB = "platform-hackaton-2025";
module.exports = { bigquery, nameDB };

const impressionsRouter = require("./routes/impressionsRoutes")
const clicksRouter = require("./routes/clicksRoutes");

app.use("/impressions",impressionsRouter);
app.use("/clicks", clicksRouter);

app.get('/user', (req, res) => {
  res.json({ name: 'John Doe' }); 
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
