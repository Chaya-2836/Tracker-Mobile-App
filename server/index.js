// server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
// פתרון בעיית ה cors
app.use(cors());
app.use(express.json());

const { BigQuery } = require("@google-cloud/bigquery");
//צריך להוסיף את ניתוב לקובץ ההרשאות
const bigquery = new BigQuery({
    keyFilename: ""
});
const nameDB = "platform-hackaton-2025";
module.exports = { bigquery, nameDB };

const eventsSummaryRoutes = require("./routes/eventsSummaryRoutes");
app.use("/events_summary", eventsSummaryRoutes);

const filtersRoutes = require('./routes/filtersRoutes');
app.use('/filters', filtersRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
