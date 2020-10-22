const { Client } = require('pg');

const clientConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const client = new Client(clientConfig);

client.connect();
