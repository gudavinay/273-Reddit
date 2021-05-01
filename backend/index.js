const app = require("./app");
const { port } = require("./Util/config");

const mongoRouter = require("./routes/mongo/router");
const sqlRouter = require("./routes/sql/router");

app.use("/mongoRouter", mongoRouter);
app.use("/sqlRouter", sqlRouter);

const sqldb = require("./models/sql");
sqldb.sequelize.sync().then(() => {
  console.log("sequelize is running");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("App is listening to 3001");
});
module.exports = app;
