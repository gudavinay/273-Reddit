const app = require("./app");
const { port } = require("./Util/config");
const uploadImage = require("./routes/awsS3");
// const mongoRouter = require("./routes/mongo/router");
// const sqlRouter = require("./routes/sql/router");
const kafkaSqlRouter = require("./kafkaRoutes/sql/router");
const kafkaMongoRouter = require("./kafkaRoutes/mongo/router");
app.use("/upload", uploadImage);
// app.use("/mongoRouter", mongoRouter);
// app.use("/sqlRouter", sqlRouter);
app.use("/kafkaSqlRouter", kafkaSqlRouter);
app.use("/kafkaMongoRouter", kafkaMongoRouter);

// const sqldb = require("./models/sql");
// sqldb.sequelize.sync().then(() => {
//   console.log("sequelize is running");
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("App is listening to 3001");
});
module.exports = app;
