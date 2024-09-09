const express = require("express");
const route = express.Router();
const userRoute = require("./user.route");

// Use the user routes under the "/users" path
route.use("/users", userRoute);

// Export the router correctly
module.exports = route;
