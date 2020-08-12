const path = require("path");
const express = require("express");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

/* implement cors */
app.use(cors());
app.options("*", cors());

/* body parser, parse data from body into req.body */
app.use(express.json({ limit: "10kb" }));

/* parses incoming requests with urlencoded payloads into req.body */
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* serving static files */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const server = app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening on port ${port}...`);
});

app.post("/payment", async (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd"
  };

  stripe.charges.create(body, (stripeError, stripeResponse) => {
    if (stripeError) {
      res.status(500).send({ error: stripeError });
    } else {
      res.status(200).send({ success: stripeResponse });
    }
  });
});
