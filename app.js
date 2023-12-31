const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const resetDebts = require('./debtReset');
const connectDB = require("./config/dataBase");
connectDB();
 app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
//Reset debts every start of month
resetDebts();

app.use("/api/products", require("./routes/productsRoutes.js"));
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/purchase", require("./routes/purchasesRoutes"));
app.use('/api/profits', require("./routes/profitsRoutes"))
app.use('/api/boxes', require("./routes/boxesRoutes"))
app.use('/api/leaderBoard',require("./routes/leaderBoardRoutes"))
app.use('/api/archivedUsers', require('./routes/archivedUsers'))
app.use('/api/history', require('./routes/historyRoutes'))

//Server Port
const port = 4040;
app.listen(port, (req, res) => {
  console.log("Server is running on port " + port);
});
