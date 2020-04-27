function knex(tableName) {
  return require("knex")({
    client: "pg",
    version: "7.2",
    connection: process.env.DB_URL || {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "firstpjt",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
    },
    //   pool: {
    //     min: 2,
    //     max: 10,
    //   },
    //   migrations: {
    //     tableName: "knex_migrations",
    //     directory: "./migrations",
    //   },
  })(tableName);
}
module.exports = { knex };

// Update with your config settings.
// const config = require("../config");

// module.exports = {
//   client: "pg",
//   connection: config.db.connection,
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     tableName: "knex_migrations",
//     directory: "./migrations",
//   },
// };
