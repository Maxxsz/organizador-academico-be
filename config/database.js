const { Pool } = require("pg");
require("dotenv").config();

const databaseName = process.env.PG_DATABASE;
const userName = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const port = process.env.PG_PORT;

const pool = new Pool({
    connectionString: `postgres://${userName}:${password}@${host}:${port}/${databaseName}`,
    ssl: {
        rejectUnauthorized: false,
    },
});

const connectionString = `postgres://${userName}:${password}@${host}:${port}/${databaseName}`;
console.log(connectionString);
module.exports = pool;
