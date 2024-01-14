module.exports = {
  client: "sqlite3",
  connection: {
    filename: "./db/data.sqlite",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
  useNullAsDefault: true,
};
