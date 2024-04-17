let pg = require("pg");
let client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservations_db"
);

let createTables = async () => {
  //customer(id, name); restaurant(id, name);
  //reservation(id, date, party_count, restaurant_id, customer_id)
  let SQL = `
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS restaurants;
  DROP TABLE IF EXISTS reservations;

  CREATE TABLE customers(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE restaurants(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE reservations(
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    party_count INTEGER NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
    customer_id UUID REFERENCES customers(id) NOT NULL
  );
  `;
  await client.query(SQL);
};

module.exports = {
  client,
  createTables,
};
