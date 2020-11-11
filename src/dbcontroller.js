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
        `SELECT s.name, s.fotourl AS img, AVG(r.rating) as rating
        FROM "Service" s, "Category" c, "Review" r
        WHERE c.name=$1
        AND s.category=c.categoryid
        AND r.serviceid=s.serviceid
        GROUP BY s.name, img`,
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

  async getUser(user) {
    const rows = await client
      .query(
        `SELECT s.name, r.rating, r.comment 
        FROM "Service" s, "Review" r
        WHERE r.serviceid = s.serviceid
        AND r.userid = $1`,
        [user]
      )
      .then((r) => r.rows)
      .catch((err) => console.log(err));
    return rows;
  }

  async getServiceReviews(service) {
    const rows = await client
      .query(
        `SELECT r.comment, u.nombre AS name, r.rating, u.fotourl, r.reviewdate
      FROM "Review" r, "Service" s, "User" u
      WHERE s.name=$1 AND r.serviceid=s.serviceid
      AND r.userid=u.userid
      ORDER BY r.reviewdate DESC`,
        [service]
      )
      .then((r) => r.rows)
      .catch((err) => console.error(err));

    return rows;
  }

  async getServiceAverage(service) {
    const rows = await client
      .query(
        `SELECT AVG(r.rating)
      FROM "Review" r, "Service" s
      WHERE s.name=$1 AND r.serviceid=s.serviceid`,
        [service]
      )
      .then((r) => r.rows)
      .catch((err) => console.error(err));

    return rows[0];
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

    client.query(
      `INSERT INTO "Review"(comment, userid, serviceid, rating, reviewdate)
    VALUES($1, $2, $3, $4, $5)`,
      [comment, userid, serviceid, rating, new Date()]
    );
  }
}

module.exports = DbController;
