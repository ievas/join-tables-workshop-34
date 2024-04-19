let pg = require("pg");
let client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservations_db"
);
let uuid = require("uuid");

let createTables = async () => {
  let SQL = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS restaurants;
  

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

let createCustomer = async (name) => {
  let SQL = `INSERT INTO customers(id, name) VALUES ($1,$2) RETURNING *`;
  let response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
let createRestaurant = async (name) => {
  let SQL = `INSERT INTO restaurants(id, name) VALUES ($1,$2) RETURNING *`;
  let response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
let fetchCustomers = async () => {
  let SQL = `SELECT * FROM customers`;
  let response = await client.query(SQL);
  return response.rows;
};
let fetchRestaurants = async () => {
  let SQL = `SELECT * FROM restaurants`;
  let response = await client.query(SQL);
  return response.rows;
};
let fetchReservations = async () => {
  let SQL = `SELECT * FROM reservations`;
  let response = await client.query(SQL);
  return response.rows;
};
let createReservation = async ({
  date,
  party_count,
  restaurant_id,
  customer_id,
}) => {
  let SQL = `INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  let response = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    restaurant_id,
    customer_id,
  ]);
  return response.rows[0];
};
let destroyReservation = async (id) => {
  let SQL = `DELETE FROM reservations WHERE id=$1`;
  await client.query(SQL, [id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
};
