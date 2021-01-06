const express = require("express");
require("./db/mongoose.js");
const scheduleRoute = require('./routers/scheduleRouter');


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(scheduleRoute);


app.listen(port, () => {
  console.log(`Server is up to the port ${port}`);
});
