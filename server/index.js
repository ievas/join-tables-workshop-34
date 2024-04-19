let {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
  fetchReservations,
} = require("./db");

let express = require("express");
let app = express();
app.use(express.json());

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});
app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});
app.post("/api/customers", async (req, res, next) => {
  try {
    res.status(201).send(await createCustomer(req.body.name));
  } catch (error) {
    next(error);
  }
});
app.post("/api/restaurants", async (req, res, next) => {
  try {
    res.status(201).send(await createRestaurant(req.body.name));
  } catch (error) {
    next(error);
  }
});
app.post("/api/reservations", async (req, res, next) => {
  try {
    res.status(201).send(await createReservation(req.body));
  } catch (error) {
    next(error);
  }
});
app.delete("/api/reservations/:id", async (req, res, next) => {
  try {
    await destroyReservation(req.params.id);
    // res.sendStatus(204);
    res.json({ message: "reservation deleted" });
  } catch (ex) {
    next(ex);
  }
});

async function init() {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");

  let port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
}

init();
