// Mongoose Connection
const {
  SQLdb,
  SQLusername,
  SQLpassword,
  SQLhost,
  mongoURI
} = require("./Util/config");
const mongoose = require("mongoose");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 20
});
const connection = mongoose.connection;
console.log("MongoDB Connected !!");

// SQL Connection
const Sequelize = require("sequelize");
const sqldb = new Sequelize(SQLdb, SQLusername, SQLpassword, {
  host: SQLhost,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sqldb
  .authenticate()
  .then(() => {
    console.log("SQL Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the SQL database:", err);
  });

// db.sync creates new empty tables everytime in the database. Uncomment only when deleted all tables and you want sequelize to create them anew.
// sqldb.sync({ force: true });

module.exports = sqldb;
