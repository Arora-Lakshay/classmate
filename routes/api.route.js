const express = require("express");
const { createJobTemplate, discardDraft, saveDraft, saveJob, registerJob } = require("../controllers/api.controller");
const { authenticate, validateAccess, validateGuest } = require("../middlewares/auth.status");

const router = express.Router();

router.route("/create-job").post(authenticate, validateAccess, createJobTemplate);

router.route("/save-job").get(authenticate, validateAccess, saveJob);

router.route("/:token/register").get(authenticate, registerJob);

router.route("/draft/discard").post(authenticate, validateAccess, discardDraft);

router.route("/draft/save").post(authenticate, validateAccess, saveDraft);

module.exports = router;
