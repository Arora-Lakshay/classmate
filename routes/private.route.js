const express = require("express");
const { dashboard, jobs, notifications, messages, createJob, drafts, editJob, viewJob, viewRegisteredStudents } = require("../controllers/private.controller");
const { authenticate, validateAccess } = require("../middlewares/auth.status");
const { createJobSlot } = require("../middlewares/jobs.middleware");

const router = express.Router();

router.route("/dashboard").get(authenticate, dashboard);

router.route("/jobs").get(authenticate, jobs);

router.route("/jobs/:token/view").get(authenticate, viewJob);

router.route("/jobs/:token/status").get(authenticate, viewRegisteredStudents);

router.route("/notifications").get(authenticate, notifications);

router.route("/messages").get(authenticate, messages);

router.route("/drafts").get(authenticate, validateAccess, drafts);

router.route("/create-job").get(authenticate, validateAccess, createJobSlot, createJob);

router.route("/create-job/:jobSlot/edit").get(authenticate, validateAccess, editJob);

module.exports = router;
