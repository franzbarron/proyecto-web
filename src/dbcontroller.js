const { Client } = require('pg');

let clientConfig;

if (process.env.PRODUCTION) {
  clientConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  clientConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  };
}

const client = new Client(clientConfig);

client.connect();

client.query('SELECT NOW()', (err, res) => {
  if (err) console.error(err);
  else console.log(`Connection with db made on ${res.rows[0].now}`);
});

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
    let rows = await client
      .query(
        `SELECT s.name, s.fotourl AS img, CASE 
            WHEN AVG(s.rating) IS NULL THEN 0
            ELSE AVG(s.rating)
        END AS rating
        FROM "Category" c, (
            SELECT s.*, r.rating
            FROM "Service" s
            LEFT JOIN (
                SELECT serviceid, AVG(rating) AS rating
                FROM "Review"
                GROUP BY serviceid
            ) r
            ON s.serviceid=r.serviceid
        ) s
        WHERE c.name=$1
        AND s.category=c.categoryid
        GROUP BY s.name, img;`,
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

  async getUserReviews(user) {
    const rows = await client
      .query(
        `SELECT s.name, r.rating, r.comment, r.reviewdate 
        FROM "Service" s, "Review" r
        WHERE r.serviceid = s.serviceid
        AND r.userid = $1
        ORDER BY r.reviewdate DESC`,
        [user]
      )
      .then((r) => r.rows)
      .catch((err) => console.log(err));
    return rows;
  }

  async getServiceReviews(service) {
    const rows = await client
      .query(
        `SELECT r.comment, u.nombre AS name, u.userid, r.rating, u.fotourl, r.reviewdate
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

  async getLatestReviewedServices(limit) {
    const rows = client
      .query(
        `SELECT s.name, s.fotourl AS img, a.avg, r.serviceid
        FROM (
            SELECT DISTINCT ON (serviceid) *
            FROM "Review"
            ORDER BY serviceid, reviewdate DESC
        ) r, (
            SELECT serviceid, AVG(rating)
            FROM "Review"
            GROUP BY serviceid
        ) a, "Service" s
        WHERE s.serviceid=r.serviceid
        AND s.serviceid=a.serviceid
        ORDER BY reviewdate DESC
        LIMIT $1`,
        [limit]
      )
      .then((r) => r.rows)
      .catch((err) => {
        console.error(err);
      });
    return rows;
  }

  async getUserData(user) {
    const rows = await client
      .query(
        `SELECT COUNT(r.rating) AS totalreviews, AVG(r.rating) AS average
        FROM "User" u, "Review" r
        WHERE u.userid=$1
        AND r.userid=u.userid`,
        [user]
      )
      .then((r) => r.rows)
      .catch((err) => {
        console.error(err);
      });

    return rows[0];
  }

  async getFullUserData(user) {
    const rows = await client
      .query(
        `SELECT u.nombre AS name, u.fotourl AS img, u.email, COUNT(r.rating) AS totalreviews, AVG(r.rating) AS average
        FROM "User" u, "Review" r
        WHERE u.userid=$1
        AND r.userid=u.userid
        GROUP BY name, img, u.email;`,
        [user]
      )
      .then((r) => r.rows)
      .catch((err) => {
        console.error(err);
      });

    return rows[0];
  }
}

module.exports = DbController;
