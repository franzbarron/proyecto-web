const { Client } = require('pg');

const clientConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const client = new Client(clientConfig);

client.connect();

class DbController {
  constructor() {}

  async findUser(id) {
    const rows = await client
      .query('SELECT * FROM "User" WHERE userid=$1', [id])
      .then((r) => r.rows)
      .catch((err) => console.error(err));
    return rows.length ? rows[0] : null;
  }

  addUser(id, nombre, foto, email) {
    client.query('INSERT INTO "User" VALUES($1, $2, $3, $4)', [
      id,
      nombre,
      foto,
      email
    ]);
  }
}

module.exports = DbController;
