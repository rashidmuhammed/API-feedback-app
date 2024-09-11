const mongoose = require("mongoose");
const Assignment = require("../models/feedbackModel");
const asyncHandler = require("express-async-handler");

const assignUseres = asyncHandler(async (req, res) => {
  const { adminId, assignedTo, employees } = req.body;

  try {
    const newAssignment = new Assignment({
      adminId,
      assignedTo,
      employees: employees.map((emp) => ({ employeeId: emp })),
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getTaskForLoggedUser = asyncHandler(async (req, res) => {
  const { employeeId } = req.body;

  try {
    const assignments = await Assignment.find({
      "employees.employeeId": employeeId,
    });

    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignments found for the employee" });
    }

    const assignedToFields = assignments.map(
      (assignment) => assignment.assignedTo
    );

    return res.json({
      message: "Assignments found",
      assignedTo: assignedToFields,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = { assignUseres, getTaskForLoggedUser };
