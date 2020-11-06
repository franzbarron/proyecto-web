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

  async getCategories() {
    const rows = await client
      .query('SELECT name, fotourl AS img FROM "Category"')
      .then((r) => r.rows)
      .catch((err) => console.error(err));
    return rows;
  }

  async getAllServices(category) {
    const rows = await client
      .query(
        'SELECT s.name, s.fotourl AS img FROM "Service" s, "Category" c WHERE c.name=$1 AND s.category=c.categoryid',
        [category]
      )
      .then((r) => r.rows)
      .catch((err) => console.error(err));

    return rows;
  }

  async getService(service) {
    const rows = await client
      .query(
        `SELECT serviceid, name, category, fotourl AS img FROM "Service" WHERE name=$1`,
        [service]
      )
      .then((r) => r.rows)
      .catch((err) => console.error(err));

    return rows[0];
  }

  async getReviews(service) {
    const rows = await client
      .query(`SELECT * FROM "Review"`)
      .then((r) => r.rows)
      .catch((err) => console.error(err));

    return rows;
  }

  async getServiceID(service) {
    const rows = await client
      .query(`SELECT serviceid FROM "Service" WHERE name=$1`, [service])
      .then((r) => r.rows)
      .catch((err) => console.error(err));

    return rows[0];
  }

  async addReview(comment, userid, service, rating) {
    const { serviceid } = await this.getServiceID(service);

    console.log(serviceid);
    client.query(
      `INSERT INTO "Review"(comment, userid, serviceid, rating)
    VALUES($1, $2, $3, $4)`,
      [comment, userid, serviceid, rating]
    );
  }
}

module.exports = DbController;
