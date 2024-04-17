let { client, createTables } = require("./db");

async function init() {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
}

init();
