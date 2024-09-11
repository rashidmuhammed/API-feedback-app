const express = require("express");
const route = express.Router();
const userRoute = require("./user.route");
const tasksRoute = require("./feedback.route");

// Use the user routes under the "/users" path
route.use("/users", userRoute);
route.use("/tasks", tasksRoute);

// Export the router correctly
module.exports = route;
