const express = require("express");
const router = express.Router();
const feedback = require("../controllers/feedbackController");

router.route("/assigments").post(feedback.assignUseres);
router.route("/getTaskForLoggedUser").post(feedback.getTaskForLoggedUser);

module.exports = router;
