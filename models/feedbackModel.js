const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employees: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      feedback: { type: String, default: "" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", assignmentSchema, "assignments");
